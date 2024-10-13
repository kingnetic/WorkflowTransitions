using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class WorkflowService
{
    private readonly string _connectionString;

    public WorkflowService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<DataTable> GetWorkflowTransitions(int procesoId, string accion, int flujo)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            await connection.OpenAsync();

            using (var command = new SqlCommand("sp_WorkflowTransitions", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@ProcesoID", procesoId);
                command.Parameters.AddWithValue("@Accion", accion);
                command.Parameters.AddWithValue("@Flujo", flujo);

                var dataTable = new DataTable();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    dataTable.Load(reader);
                }

                return dataTable;
            }
        }
    }

    public async Task<bool> PerformTransition(int procesoId, string accion, int flujo, int objId, int userId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            await connection.OpenAsync();

            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    // Get the transition details
                    var transitions = await GetWorkflowTransitions(procesoId, accion, flujo);
                    if (transitions.Rows.Count == 0)
                    {
                        throw new Exception("Invalid transition");
                    }

                    var transition = transitions.Rows[0];
                    int sprFlujoAccionId = Convert.ToInt32(transition["SprFlujoAccionID"]);
                    int estadoInicial = Convert.ToInt32(transition["objStbEstadoInicial"]);
                    int estadoFinal = Convert.ToInt32(transition["objStbEstadoFinal"]);

                    // Update the state in the main table (assuming there's a table for the process)
                    string updateMainTableSql = "UPDATE YourMainTable SET Estado = @EstadoFinal WHERE ID = @ObjID AND Estado = @EstadoInicial";
                    using (var command = new SqlCommand(updateMainTableSql, connection, transaction))
                    {
                        command.Parameters.AddWithValue("@EstadoFinal", estadoFinal);
                        command.Parameters.AddWithValue("@ObjID", objId);
                        command.Parameters.AddWithValue("@EstadoInicial", estadoInicial);
                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Failed to update main table state");
                        }
                    }

                    // Insert into history table
                    string insertHistorySql = @"
                        INSERT INTO WF.SprHistorialFlujoAcciones 
                        (objID, objSprFlujoAccionID, objStbTipoFlujoID, FechaInicio, FechaFinal, UsuarioCreacion, FechaCreacion)
                        VALUES (@ObjID, @SprFlujoAccionID, @TipoFlujoID, GETDATE(), GETDATE(), @UsuarioCreacion, GETDATE())";
                    using (var command = new SqlCommand(insertHistorySql, connection, transaction))
                    {
                        command.Parameters.AddWithValue("@ObjID", objId);
                        command.Parameters.AddWithValue("@SprFlujoAccionID", sprFlujoAccionId);
                        command.Parameters.AddWithValue("@TipoFlujoID", flujo == 1 ? 143 : 144);
                        command.Parameters.AddWithValue("@UsuarioCreacion", userId);
                        await command.ExecuteNonQueryAsync();
                    }

                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}
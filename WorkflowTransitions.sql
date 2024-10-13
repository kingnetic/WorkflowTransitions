CREATE PROCEDURE [dbo].[sp_WorkflowTransitions]
    @ProcesoID INT,
    @Accion NVARCHAR(50),
    @Flujo INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Accion = 'Todos'
    BEGIN
        IF @Flujo = 1
            SELECT * FROM WFFlujoAccionProceso
            WHERE SprProcesosID = @ProcesoID AND Nivel > 0
            ORDER BY Nivel ASC;
        ELSE IF @Flujo = -1
            SELECT * FROM WFFlujoAccionProceso
            WHERE SprProcesosID = @ProcesoID AND Nivel > 0
            ORDER BY Nivel DESC;
    END
    ELSE
    BEGIN
        SELECT * FROM WFFlujoAccionProceso
        WHERE SprProcesosID = @ProcesoID AND Accion = @Accion
        AND ((@Flujo = 1 AND Nivel > 0) OR (@Flujo = -1 AND Nivel > 0))
        ORDER BY CASE WHEN @Flujo = 1 THEN Nivel ELSE -Nivel END;
    END
END
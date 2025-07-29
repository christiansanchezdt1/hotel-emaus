-- Crear función para validar solapamiento de fechas en reservas
CREATE OR REPLACE FUNCTION validate_reserva_dates()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si hay reservas que se solapen para la misma habitación
  IF EXISTS (
    SELECT 1 
    FROM reservas 
    WHERE habitacion_id = NEW.habitacion_id
      AND id != COALESCE(NEW.id, -1) -- Excluir la reserva actual en caso de UPDATE
      AND estado IN ('confirmada', 'checkin', 'pendiente') -- Solo reservas activas
      AND fecha_checkin < NEW.fecha_checkout -- La reserva existente empieza antes de que termine la nueva
      AND fecha_checkout > NEW.fecha_checkin -- La reserva existente termina después de que empiece la nueva
  ) THEN
    RAISE EXCEPTION 'La habitación % ya tiene una reserva en el rango de fechas % - %', 
      NEW.habitacion_id, NEW.fecha_checkin, NEW.fecha_checkout;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para INSERT
DROP TRIGGER IF EXISTS validate_reserva_dates_insert ON reservas;
CREATE TRIGGER validate_reserva_dates_insert
  BEFORE INSERT ON reservas
  FOR EACH ROW
  EXECUTE FUNCTION validate_reserva_dates();

-- Crear trigger para UPDATE
DROP TRIGGER IF EXISTS validate_reserva_dates_update ON reservas;
CREATE TRIGGER validate_reserva_dates_update
  BEFORE UPDATE ON reservas
  FOR EACH ROW
  EXECUTE FUNCTION validate_reserva_dates();

-- Comentario explicativo
COMMENT ON FUNCTION validate_reserva_dates() IS 'Valida que no haya solapamiento de fechas para reservas de la misma habitación';

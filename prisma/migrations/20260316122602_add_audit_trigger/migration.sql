CREATE OR REPLACE FUNCTION process_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id UUID;
    current_ip TEXT;
BEGIN
    -- Pulling custom variables set from Node.js (Prisma)
    current_user_id := NULLIF(current_setting('app.current_user_id', true), '')::UUID;
    current_ip := NULLIF(current_setting('app.current_ip', true), '');

    INSERT INTO "audit_logs" (
        id, 
        model, 
        model_id, 
        action, 
        old_data, 
        new_data, 
        performed_by, 
        ip, 
        created_at
    )
    VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END, -- Extracts the ID of the row
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        current_user_id,
        current_ip,
        NOW()
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach to your tables
CREATE TRIGGER audit_user_changes
AFTER INSERT OR UPDATE OR DELETE ON "users"
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

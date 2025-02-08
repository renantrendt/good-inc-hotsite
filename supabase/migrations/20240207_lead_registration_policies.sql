-- Remover a tabela antiga se existir
DROP TABLE IF EXISTS leads CASCADE;

-- Criar a tabela leads
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    cpf TEXT UNIQUE,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT,
    city_code TEXT,
    clothes_odor TEXT NOT NULL,
    product_understanding TEXT NOT NULL,
    main_focus TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Remover todas as policies existentes
DROP POLICY IF EXISTS "Enable insert for service role" ON leads;
DROP POLICY IF EXISTS "Enable read for service role" ON leads;
DROP POLICY IF EXISTS "Enable update for service role" ON leads;
DROP POLICY IF EXISTS "Enable delete for service role" ON leads;

-- Criar policy para permitir todas as operações para o service role
CREATE POLICY "service_role_all"
    ON leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Garantir que o service_role tenha todas as permissões na tabela
GRANT ALL ON leads TO service_role;


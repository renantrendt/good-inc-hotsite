-- Criar a tabela leads se ela não existir
CREATE TABLE IF NOT EXISTS leads (
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

-- Criar policy para permitir inserções usando service role
CREATE POLICY "Enable insert for service role"
    ON leads
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Criar policy para permitir leitura usando service role
CREATE POLICY "Enable read for service role"
    ON leads
    FOR SELECT
    TO service_role
    USING (true);

-- Criar policy para permitir atualizações usando service role
CREATE POLICY "Enable update for service role"
    ON leads
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Criar policy para permitir deleções usando service role
CREATE POLICY "Enable delete for service role"
    ON leads
    FOR DELETE
    TO service_role
    USING (true);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

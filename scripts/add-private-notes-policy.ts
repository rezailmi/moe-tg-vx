import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function addPolicy() {
  console.log('🔐 Adding DEV policy for student_private_notes...\n')

  const policySQL = `
    CREATE POLICY IF NOT EXISTS "DEV: Public read student_private_notes"
      ON student_private_notes FOR SELECT
      TO anon, authenticated
      USING (true);
  `

  const { data, error } = await supabase.rpc('exec_sql', { sql: policySQL })

  if (error) {
    // Try direct query if RPC doesn't exist
    console.log('RPC not available, using direct query...')

    const { error: directError } = await supabase
      .from('_sql')
      .select('*')
      .single()

    console.log('Executing SQL directly via connection...')
  }

  console.log('Policy SQL to execute:')
  console.log(policySQL)
  console.log('\n✅ Please run this SQL in the Supabase SQL Editor manually.')
}

addPolicy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })

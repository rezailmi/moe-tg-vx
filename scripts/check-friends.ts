import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkFriends() {
  const { data, error } = await supabase
    .from('friend_relationships')
    .select('*')

  console.log('Friend relationships:', data?.length || 0)
  if (data && data.length > 0) {
    console.log(JSON.stringify(data, null, 2))
  }
  if (error) {
    console.error('Error:', error)
  }
}

checkFriends()

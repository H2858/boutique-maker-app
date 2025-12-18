import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting cleanup of expired products...')

    // Get all expired products
    const { data: expiredProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, product_images(image_url)')
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null)

    if (fetchError) {
      console.error('Error fetching expired products:', fetchError)
      throw fetchError
    }

    console.log(`Found ${expiredProducts?.length || 0} expired products`)

    if (!expiredProducts || expiredProducts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No expired products found', deleted: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Delete images from storage
    for (const product of expiredProducts) {
      if (product.product_images && product.product_images.length > 0) {
        const imageUrls = product.product_images.map((img: any) => img.image_url)
        
        for (const url of imageUrls) {
          try {
            // Extract filename from URL
            const urlParts = url.split('/')
            const fileName = urlParts[urlParts.length - 1]
            
            if (fileName) {
              const { error: deleteError } = await supabase.storage
                .from('product-images')
                .remove([fileName])
              
              if (deleteError) {
                console.error(`Failed to delete image ${fileName}:`, deleteError)
              } else {
                console.log(`Deleted image: ${fileName}`)
              }
            }
          } catch (e) {
            console.error('Error deleting image:', e)
          }
        }
      }
    }

    // Delete products (cascade will handle related tables)
    const productIds = expiredProducts.map(p => p.id)
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', productIds)

    if (deleteError) {
      console.error('Error deleting products:', deleteError)
      throw deleteError
    }

    console.log(`Successfully deleted ${productIds.length} expired products`)

    return new Response(
      JSON.stringify({ 
        message: 'Cleanup completed successfully', 
        deleted: productIds.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Cleanup error:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
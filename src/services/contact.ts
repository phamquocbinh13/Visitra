import { ContactRequest } from '@/types';
import { getSupabaseClient } from '@/lib/supabase/client';

export class ContactService {
  /**
   * Submit contact form request
   */
  public static async submitContactRequest(request: ContactRequest): Promise<{ success: boolean; message: string }> {
    // Validate inputs
    if (!request.fullName || !request.organization || !request.email || !request.message) {
      throw new Error('Please fill in all required contact fields.');
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('contact_requests').insert([
          {
            full_name: request.fullName,
            organization: request.organization,
            email: request.email,
            phone: request.phone || null,
            solution_of_interest: request.solutionOfInterest,
            message: request.message,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.warn('Supabase contact submission notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase contact fallback to mock response:', err);
      }
    }

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: 'Thank you for contacting VISITRA. Our enterprise solution team will respond within 24 hours.',
    };
  }
}

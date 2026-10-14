import { Person } from '@/types';
import { getSupabaseClient } from '@/lib/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export class PersonsService {
  private static mockPersons: Person[] = [
    {
      id: '1',
      name: 'Nguyen Van A',
      identifier: 'SV001',
      department: 'Applied AI Systems',
      clearance: 'SECURITY LEVEL 3',
      registeredVectorsCount: 4,
      createdAt: new Date().toISOString(),
      photos: [
        {
          id: 'p1',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37PUckrVDhb8lPMTWWeHug1WKnNfN6RoQFs7HRPCzC7F3u2W67lsd52iv7aIvcqJ8lmJJXL2d_SzSRyNgJRfxC4PKUcLpeDrx949zXqa9Ad6rutDyG-cd-TevNpgxD3GxSPHPve9iWOKHPEMmCtTzPoqJ04RFUzgB5nptLbE-nxmyjrdG_JghIT3A7YLa5ud9FMkENOxkVNtNMzN7GqWGGo3Cl4UAwunS8J_ymlbH3wMzsuWiJHAq',
          angleLabel: 'FRONT',
          vectorExtracted: true,
        },
      ],
    },
    {
      id: '2',
      name: 'Sarah Lin',
      identifier: 'EMP-042',
      department: 'Director of Autonomous Ops',
      clearance: 'EXECUTIVE CLEARANCE',
      registeredVectorsCount: 4,
      createdAt: new Date().toISOString(),
      photos: [
        {
          id: 'p2',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYnhW-NmygMjeZEpEnNyiYDGeXeneTWld916IwGaZuc5yvGSfTk9DUPxLZ9FWf02_R7kKbKObDaOrY8n3F1K3CpphHWdDrtxKo5xSzb9DFXnHlxpKqXbll6VT0H0T3ziQ42GipCdFQD5ppB9U8fwcmtotu51jKDd0jS4tB0muCxfWqtSLXPRb8uDlz4_yitNrHqtWgSqRH6xn9a_122QxBv5CX2BvdAWd2zK14fB3JthQj5L_Ze9eu',
          angleLabel: 'FRONT',
          vectorExtracted: true,
        },
      ],
    },
    {
      id: '3',
      name: 'Marcus Chen',
      identifier: 'VIS-881',
      department: 'Audit Contractor',
      clearance: 'TEMPORARY PASS',
      registeredVectorsCount: 3,
      createdAt: new Date().toISOString(),
      photos: [
        {
          id: 'p3',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ccRmNd8Yfi6D4Bi2NIWZMAlJ3AAY_dJIvq0z3fODRGY4Eay_VuW7GwKIgBDEcIIsxWj7wg9m7hFBWTVe1kC3hZ-qn-cfDpp7oLDHypdWfbAAQ3HEeTvG9xbuqLb-jHis4Zk666nsp_o0b5-fxfjcdT3SSoBzEiVxHDaTDVoYgdHyt7cT2U-OnaDfDLi-Cw5c_qCwgzmDdpJfRCE9OXsjVjvTHs2TRJMEa-n4DuXmylczVKEAsqcP',
          angleLabel: 'FRONT',
          vectorExtracted: true,
        },
      ],
    },
  ];

  /**
   * Fetch list of enrolled persons (GET /api/persons boundary)
   */
  public static async getPersons(): Promise<Person[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('persons').select('*');
        if (!error && data && data.length > 0) {
          return data as Person[];
        }
      } catch (err) {
        console.warn('Supabase fetch persons fallback:', err);
      }
    }

    if (API_BASE_URL && API_BASE_URL.startsWith('http://real-backend')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/persons`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend API connection fallback to mock persons:', err);
      }
    }

    return [...this.mockPersons];
  }

  /**
   * Create a new person profile (POST /api/persons boundary)
   */
  public static async createPerson(personData: Omit<Person, 'id' | 'createdAt'>): Promise<Person> {
    const newPerson: Person = {
      ...personData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('persons').insert([newPerson]);
      } catch (err) {
        console.warn('Supabase insert person fallback:', err);
      }
    }

    this.mockPersons.push(newPerson);
    return newPerson;
  }
}

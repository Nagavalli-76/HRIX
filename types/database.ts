export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "creator" | "brand" | "admin";

export type CategoryType =
  | "Fashion"
  | "Food"
  | "Fitness"
  | "Education"
  | "Technology"
  | "Beauty"
  | "Travel"
  | "Lifestyle"
  | "Gaming"
  | "Finance"
  | "Real Estate";

export type CityType =
  | "Hyderabad"
  | "Kakinada"
  | "Rajahmundry"
  | "Vijayawada"
  | "Visakhapatnam"
  | "Bengaluru"
  | "Chennai"
  | "Mumbai"
  | "Remote";

export type SocialPlatform = "Instagram" | "YouTube" | "X" | "LinkedIn";

export type TrustState =
  | "registered-creator"
  | "verified-creator"
  | "verified-brand"
  | "verified-campaign"
  | "verification-pending"
  | "action-required";

export type CampaignStatus = "open" | "closing-soon" | "closed";

export type ApplicationStatus = "submitted" | "shortlisted" | "accepted" | "rejected" | "withdrawn";

export type CollaborationStatus =
  | "pending"
  | "accepted"
  | "active"
  | "content-submitted"
  | "under-review"
  | "revision-requested"
  | "approved"
  | "published"
  | "completed";

export type NotificationKind =
  | "new-campaign"
  | "campaign-match"
  | "application-submitted"
  | "application-accepted"
  | "application-rejected"
  | "new-message"
  | "content-review"
  | "revision-requested"
  | "content-approved"
  | "payment"
  | "subscription";

export type SubscriptionStatus = "active" | "past-due" | "canceled" | "none";

export type InvoiceStatus = "paid" | "due" | "failed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      creator_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          slug: string;
          display_name: string;
          bio: string;
          category: CategoryType;
          niche: string;
          city: CityType;
          languages: string[];
          follower_count: number;
          engagement_rate: number;
          starting_rate_inr: number;
          profile_image_url: string | null;
          trust: TrustState;
          availability: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          slug: string;
          display_name: string;
          bio?: string;
          category?: CategoryType;
          niche?: string;
          city?: CityType;
          languages?: string[];
          follower_count?: number;
          engagement_rate?: number;
          starting_rate_inr?: number;
          profile_image_url?: string | null;
          trust?: TrustState;
          availability?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          slug?: string;
          display_name?: string;
          bio?: string;
          category?: CategoryType;
          niche?: string;
          city?: CityType;
          languages?: string[];
          follower_count?: number;
          engagement_rate?: number;
          starting_rate_inr?: number;
          profile_image_url?: string | null;
          trust?: TrustState;
          availability?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      brand_profiles: {
        Row: {
          id: string;
          user_id: string;
          brand_name: string;
          slug: string;
          logo_url: string | null;
          description: string;
          industry: CategoryType;
          city: CityType;
          website: string | null;
          trust: TrustState;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          brand_name: string;
          slug: string;
          logo_url?: string | null;
          description?: string;
          industry?: CategoryType;
          city?: CityType;
          website?: string | null;
          trust?: TrustState;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          brand_name?: string;
          slug?: string;
          logo_url?: string | null;
          description?: string;
          industry?: CategoryType;
          city?: CityType;
          website?: string | null;
          trust?: TrustState;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_accounts: {
        Row: {
          id: string;
          creator_id: string;
          platform: SocialPlatform;
          handle: string;
          followers: number;
          engagement_rate: number;
          profile_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          platform: SocialPlatform;
          handle: string;
          followers?: number;
          engagement_rate?: number;
          profile_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          platform?: SocialPlatform;
          handle?: string;
          followers?: number;
          engagement_rate?: number;
          profile_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_items: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          brand: string | null;
          category: CategoryType;
          media_url: string | null;
          external_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          brand?: string | null;
          category?: CategoryType;
          media_url?: string | null;
          external_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          brand?: string | null;
          category?: CategoryType;
          media_url?: string | null;
          external_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          slug: string;
          summary: string;
          category: CategoryType;
          city: CityType;
          budget_inr: number;
          deliverables: string[];
          platforms: SocialPlatform[];
          deadline: string;
          status: CampaignStatus;
          trust: TrustState;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          slug: string;
          summary: string;
          category: CategoryType;
          city?: CityType;
          budget_inr: number;
          deliverables?: string[];
          platforms?: SocialPlatform[];
          deadline: string;
          status?: CampaignStatus;
          trust?: TrustState;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          category?: CategoryType;
          city?: CityType;
          budget_inr?: number;
          deliverables?: string[];
          platforms?: SocialPlatform[];
          deadline?: string;
          status?: CampaignStatus;
          trust?: TrustState;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaign_applications: {
        Row: {
          id: string;
          campaign_id: string;
          creator_id: string;
          proposal: string | null;
          expected_price: number | null;
          match_score: number;
          status: ApplicationStatus;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          creator_id: string;
          proposal?: string | null;
          expected_price?: number | null;
          match_score?: number;
          status?: ApplicationStatus;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          creator_id?: string;
          proposal?: string | null;
          expected_price?: number | null;
          match_score?: number;
          status?: ApplicationStatus;
          submitted_at?: string;
          updated_at?: string;
        };
      };
      collaborations: {
        Row: {
          id: string;
          campaign_id: string;
          creator_id: string;
          application_id: string | null;
          status: CollaborationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          creator_id: string;
          application_id?: string | null;
          status?: CollaborationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          creator_id?: string;
          application_id?: string | null;
          status?: CollaborationStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      collaboration_events: {
        Row: {
          id: string;
          collaboration_id: string;
          status: CollaborationStatus;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          collaboration_id: string;
          status: CollaborationStatus;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          collaboration_id?: string;
          status?: CollaborationStatus;
          note?: string | null;
          created_at?: string;
        };
      };
      shortlisted_creators: {
        Row: {
          id: string;
          brand_id: string;
          creator_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          creator_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          creator_id?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          campaign_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string | null;
          body: string;
          is_system: boolean;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id?: string | null;
          body: string;
          is_system?: boolean;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string | null;
          body?: string;
          is_system?: boolean;
          read?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          kind: NotificationKind;
          title: string;
          body: string;
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kind: NotificationKind;
          title: string;
          body: string;
          read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kind?: NotificationKind;
          title?: string;
          body?: string;
          read?: boolean;
          link?: string | null;
          created_at?: string;
        };
      };
      verification_requests: {
        Row: {
          id: string;
          user_id: string;
          entity_type: "creator" | "brand";
          entity_id: string;
          document_urls: string[];
          status: TrustState;
          admin_notes: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          reviewer_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          entity_type: "creator" | "brand";
          entity_id: string;
          document_urls?: string[];
          status?: TrustState;
          admin_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewer_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          entity_type?: "creator" | "brand";
          entity_id?: string;
          document_urls?: string[];
          status?: TrustState;
          admin_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewer_id?: string | null;
        };
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_user_id: string | null;
          action: string;
          target_type: string;
          target_id: string | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id?: string | null;
          action: string;
          target_type: string;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_user_id?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          tagline: string;
          price: number;
          type: string;
          badge: string | null;
          features: string[];
          duration_days: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          tagline: string;
          price: number;
          type?: string;
          badge?: string | null;
          features?: string[];
          duration_days?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string;
          price?: number;
          type?: string;
          badge?: string | null;
          features?: string[];
          duration_days?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          renews_on: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: SubscriptionStatus;
          renews_on?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          status?: SubscriptionStatus;
          renews_on?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          amount_inr: number;
          status: InvoiceStatus;
          issued_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          amount_inr: number;
          status?: InvoiceStatus;
          issued_on?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          description?: string;
          amount_inr?: number;
          status?: InvoiceStatus;
          issued_on?: string;
          created_at?: string;
        };
      };
    };
  };
}

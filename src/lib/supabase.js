import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations

// Settings
export const getSettings = async () => {
    const { data, error } = await supabase
        .from('settings')
        .select('*');

    if (error) throw error;

    // Convert array to object for easier access
    return data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {}) || {};
};

export const updateSetting = async (key, value) => {
    const { data, error } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        .select();

    if (error) throw error;
    return data;
};

// Services/Prices
export const getServices = async () => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order');

    if (error) throw error;
    return data || [];
};

export const updateService = async (id, updates) => {
    const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

export const createService = async (service) => {
    const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select();

    if (error) throw error;
    return data;
};

export const deleteService = async (id) => {
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Appointments
export const getAppointments = async () => {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createAppointment = async (appointment) => {
    const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select();

    if (error) throw error;
    return data;
};

export const updateAppointment = async (id, updates) => {
    const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

// Gallery
export const getGalleryImages = async () => {
    const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order');

    if (error) throw error;
    return data || [];
};

export const uploadImage = async (file, bucket = 'gallery') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrl;
};

export const createGalleryImage = async (image) => {
    const { data, error } = await supabase
        .from('gallery')
        .insert(image)
        .select();

    if (error) throw error;
    return data;
};

export const deleteGalleryImage = async (id) => {
    const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const updateGalleryImage = async (id, updates) => {
    const { data, error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

// Schedules
export const getSchedules = async () => {
    const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('day_of_week');

    if (error) throw error;
    return data || [];
};

export const updateSchedule = async (id, updates) => {
    const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

// Push Subscribers
export const getPushSubscribers = async () => {
    const { data, error } = await supabase
        .from('push_subscribers')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createPushSubscriber = async (subscriber) => {
    const { data, error } = await supabase
        .from('push_subscribers')
        .insert(subscriber)
        .select();

    if (error) throw error;
    return data;
};

export const updatePushSubscriber = async (id, updates) => {
    const { data, error } = await supabase
        .from('push_subscribers')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

// Promotions
export const getPromotions = async () => {
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const getActivePromotions = async () => {
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createPromotion = async (promotion) => {
    const { data, error } = await supabase
        .from('promotions')
        .insert(promotion)
        .select();

    if (error) throw error;
    return data;
};

export const updatePromotion = async (id, updates) => {
    const { data, error } = await supabase
        .from('promotions')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

export const deletePromotion = async (id) => {
    const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Referral Program
export const getReferralProgram = async () => {
    const { data, error } = await supabase
        .from('referral_program')
        .select('*')
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const updateReferralProgram = async (updates) => {
    const { data, error } = await supabase
        .from('referral_program')
        .upsert({ ...updates, updated_at: new Date().toISOString() })
        .select();

    if (error) throw error;
    return data;
};

// Referrals
export const getReferrals = async () => {
    const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createReferral = async (referral) => {
    const { data, error } = await supabase
        .from('referrals')
        .insert(referral)
        .select();

    if (error) throw error;
    return data;
};

export const validateReferralCode = async (code) => {
    const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', code.toUpperCase())
        .eq('status', 'active')
        .single();

    if (error) return null;

    // Check if expired
    if (data && new Date(data.expires_at) < new Date()) {
        return null;
    }

    return data;
};

export const useReferralCode = async (referralId, referredData) => {
    const { data, error } = await supabase
        .from('referral_usage')
        .insert({
            referral_id: referralId,
            ...referredData,
            status: 'pending'
        })
        .select();

    if (error) throw error;

    // Update referral status
    await supabase
        .from('referrals')
        .update({ status: 'used' })
        .eq('id', referralId);

    return data;
};

// WhatsApp Subscribers
export const getWhatsAppSubscribers = async () => {
    const { data, error } = await supabase
        .from('whatsapp_subscribers')
        .select('*')
        .eq('is_active', true)
        .order('opt_in_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createWhatsAppSubscriber = async (subscriber) => {
    const { data, error } = await supabase
        .from('whatsapp_subscribers')
        .insert(subscriber)
        .select();

    if (error) throw error;
    return data;
};

// Notification History
export const createNotificationHistory = async (notification) => {
    const { data, error } = await supabase
        .from('notification_history')
        .insert(notification)
        .select();

    if (error) throw error;
    return data;
};

export const getNotificationHistory = async (promotionId) => {
    const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('promotion_id', promotionId)
        .order('sent_at', { ascending: false });

    if (error) throw error;
    return data || [];
};


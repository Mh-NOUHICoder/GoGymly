"use server";
import supabase from "@/config/supabase-config";
import { currentUser } from "@clerk/nextjs/server";
import { toast } from "sonner";

export const getCurrentUserFromSupabase = async () => {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser?.id) {
      console.log("No Clerk user found");
      return null;
    }

    // FIX 1: Use .maybeSingle() instead of .single() to handle no results
    const { data, error } = await supabase!
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUser.id)
      .maybeSingle(); // ← This handles the case when no user is found

    if (error) {
      throw error;
    }

    // FIX 2: Check data directly (not data.length) since .maybeSingle() returns object | null
    if (data ) {
      return {
        success: true,
        data: data, // ← Direct object, not data[0]
        
      };
    }

    // FIX 3: Create new user if none exists
    const newUserObj = {
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      is_active: true,
      is_admin: false,
    };

    // FIX 4: Use .maybeSingle() or handle the array properly for insert
    const { data: newUserData, error: newUserError } = await supabase!
      .from("user_profiles")
      .insert([newUserObj])
      .select("*")
      .single(); // ← .single() is OK here since we're inserting one row

    if (newUserError) {
      throw newUserError;
    }

    return {
      success: true,
      data: newUserData, // ← Direct object, not newUserData[0]
    };

  } catch (error) {
    console.log("Error fetching user from Supabase:", error);
    return null;
  }
};
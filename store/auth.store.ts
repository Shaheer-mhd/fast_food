import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand';

type AuthState = {
    isAUthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    setIsAiuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (value: boolean) => void;
    fetchAUthenticatedUser: () => Promise<void>;
}   

const useAuthStore = create<AuthState>((set) => ({
    isAUthenticated: false,
    user: null,
    isLoading: true,
    setIsAiuthenticated: (value) => set(() => ({ isAUthenticated: value })),
    setUser: (user) => set({user}),
    setLoading: (value) => set(() => ({ isLoading: value })),
    fetchAUthenticatedUser: async () => {
        set({ isLoading: true });
        try {
            const user = await getCurrentUser()
            if (user) {
                set({ isAUthenticated: true, user: user as unknown as User });
            } else {
                set({ isAUthenticated: false, user: null });
            }
        } catch (error) {
            console.log(error);
            set({isAUthenticated: false})
        } finally {
            set({ isLoading: false });
        }
    }
}))

export default useAuthStore;

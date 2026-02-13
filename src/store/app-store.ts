import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface Guild {
  id: string;
  name: string;
  icon?: string;
}

interface Relationship {
  id: string;
  type: number;
  user: {
    id: string;
    username: string;
    global_name: string;
    avatar?: string;
  };
}

interface Channel {
  id: string;
  type: number;
  recipients: Recipient[];
  name?: string;
  icon?: string;
}

interface Recipient {
  id: string;
  global_name: string;
  username: string;
  avatar?: string;
}

type SelectionType =
  | 'servers'
  | 'friends'
  | 'dms'
  | 'mutes'
  | 'friendMutes';

interface AppStore {
  token: string;
  userGuilds: Guild[];
  userFriends: Relationship[];
  userDms: Channel[];
  isLoading: boolean;
  isRefetching: boolean;
  loadingItems: string[];
  deletionProgress: {
    deleted: number;
    total: number;
  };
  selectedItems: {
    servers: string[];
    friends: string[];
    dms: string[];
    mutes: string[];
    friendMutes: string[];
  };

  isAuthenticated: boolean;

  setToken: (token: string) => void;
  clearToken: () => void;
  setLoading: (loading: boolean) => void;
  setRefetching: (refetching: boolean) => void;
  setLoadingItems: (items: string[]) => void;
  setDeletionProgress: (progress: { deleted: number; total: number }) => void;
  setSelectedItems: (items: {
    servers: string[];
    friends: string[];
    dms: string[];
    mutes: string[];
    friendMutes: string[];
  }) => void;

  selectItem: (id: string, type: SelectionType) => void;
  selectAll: (type: SelectionType, ids: string[]) => void;

  fetchUserData: () => Promise<void>;
  handleRefetch: () => Promise<void>;
  handleLogout: () => void;

  leaveServer: (guildId: string) => Promise<boolean>;
  removeFriend: (userId: string) => Promise<boolean>;
  closeDm: (channelId: string) => Promise<boolean>;
  muteServer: (guildId: string) => Promise<boolean>;
  muteFriend: (userId: string) => Promise<boolean>;

  handleDeleteSelected: () => Promise<void>;
  handleMuteSelected: () => Promise<void>;
  handleMuteFriendsSelected: () => Promise<void>;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      token: '',
      userGuilds: [],
      userFriends: [],
      userDms: [],
      isLoading: false,
      isRefetching: false,
      loadingItems: [],
      deletionProgress: { deleted: 0, total: 0 },
      selectedItems: {
        servers: [],
        friends: [],
        dms: [],
        mutes: [],
        friendMutes: [],
      },

      isAuthenticated: false,

      setToken: (token) => set({ token, isAuthenticated: !!token }),

      clearToken: () => {
        localStorage.removeItem('discord_token');
        set({ token: '', isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setRefetching: (isRefetching) => set({ isRefetching }),

      setLoadingItems: (loadingItems) => set({ loadingItems }),

      setDeletionProgress: (deletionProgress) => set({ deletionProgress }),

      setSelectedItems: (selectedItems) => set({ selectedItems }),

      selectItem: (id, type) => {
        set((state) => {
          const newSelected = { ...state.selectedItems };
          if (newSelected[type].includes(id)) {
            newSelected[type] = newSelected[type].filter((itemId) => itemId !== id);
          } else {
            newSelected[type].push(id);
          }
          return { selectedItems: newSelected };
        });
      },

      selectAll: (type, ids) => {
        set((state) => {
          const newSelected = { ...state.selectedItems };
          const currentSelected = newSelected[type];
          if (currentSelected.length === ids.length) {
            newSelected[type] = [];
          } else {
            newSelected[type] = ids;
          }
          return { selectedItems: newSelected };
        });
      },

      fetchUserData: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
              Authorization: token,
            },
          });

          if (guildsResponse.status === 401) {
            toast.error('Invalid token. You will have to log in again.');
            get().handleLogout();
            return;
          }

          if (guildsResponse.ok) {
            const guilds = await guildsResponse.json();
            set({ userGuilds: guilds });
          } else {
            throw new Error('Failed to fetch user guilds');
          }

          const friendsResponse = await fetch('https://discord.com/api/users/@me/relationships', {
            headers: {
              Authorization: token,
            },
          });

          if (friendsResponse.ok) {
            const relationships = await friendsResponse.json();
            const friends = relationships.filter((rel: Relationship) => rel.type === 1);
            set({ userFriends: friends });
          } else {
            throw new Error('Failed to fetch user friends');
          }

          const dmsResponse = await fetch('https://discord.com/api/users/@me/channels', {
            headers: {
              Authorization: token,
            },
          });

          if (dmsResponse.ok) {
            const dms = await dmsResponse.json();
            set({ userDms: dms });
          } else {
            throw new Error('Failed to fetch user DMs');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },

      handleRefetch: async () => {
        const token = get().token;
        if (!token) return;

        set({ isRefetching: true });
        try {
          await get().fetchUserData();
          toast.success('Data refreshed successfully!');
        } catch (error) {
          console.error('Error refetching data:', error);
          toast.error('Failed to refresh data. Please try again.');
        } finally {
          set({ isRefetching: false });
        }
      },

      handleLogout: () => {
        get().clearToken();
        set({
          userGuilds: [],
          userFriends: [],
          userDms: [],
        });
      },

      leaveServer: async (guildId: string) => {
        const token = get().token;
        set((state) => ({ loadingItems: [...state.loadingItems, guildId] }));

        try {
          const response = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `${token}`,
            },
          });

          if (response.ok) {
            toast.success('Successfully left server!');
            set((state) => ({
              userGuilds: state.userGuilds.filter((guild) => guild.id !== guildId),
            }));
            return true;
          } else {
            toast.error('Failed to leave server.');
            return false;
          }
        } catch (error) {
          console.error('Error leaving server:', error);
          return false;
        } finally {
          set((state) => ({
            loadingItems: state.loadingItems.filter((id) => id !== guildId),
          }));
        }
      },

      removeFriend: async (userId: string) => {
        const token = get().token;
        set((state) => ({ loadingItems: [...state.loadingItems, userId] }));

        try {
          const response = await fetch(
            `https://discord.com/api/users/@me/relationships/${userId}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (response.ok) {
            toast.success('Successfully removed friend!');
            set((state) => ({
              userFriends: state.userFriends.filter((friend) => friend.user.id !== userId),
            }));
            return true;
          } else {
            toast.error('Failed to remove friend.');
            return false;
          }
        } catch (error) {
          console.error('Error removing friend:', error);
          return false;
        } finally {
          set((state) => ({
            loadingItems: state.loadingItems.filter((id) => id !== userId),
          }));
        }
      },

      closeDm: async (channelId: string) => {
        const token = get().token;
        set((state) => ({ loadingItems: [...state.loadingItems, channelId] }));

        try {
          const response = await fetch(`https://discord.com/api/channels/${channelId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `${token}`,
            },
          });

          if (response.ok) {
            toast.success('Successfully closed DM!');
            set((state) => ({
              userDms: state.userDms.filter((dm) => dm.id !== channelId),
            }));
            return true;
          } else {
            toast.error('Failed to close DM.');
            return false;
          }
        } catch (error) {
          console.error('Error closing DM:', error);
          return false;
        } finally {
          set((state) => ({
            loadingItems: state.loadingItems.filter((id) => id !== channelId),
          }));
        }
      },

      muteServer: async (guildId: string) => {
        const token = get().token;
        set((state) => ({ loadingItems: [...state.loadingItems, guildId] }));

        try {
          const payload = {
            guilds: {
              [guildId]: {
                muted: true,
                mute_config: {
                  selected_time_window: -1,
                  end_time: null,
                },
              },
            },
          };

          const response = await fetch('https://discord.com/api/v9/users/@me/guilds/settings', {
            method: 'PATCH',
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            toast.success('Successfully muted server!');
            return true;
          } else {
            toast.error('Failed to mute server.');
            return false;
          }
        } catch (error) {
          console.error('Error muting server:', error);
          return false;
        } finally {
          set((state) => ({
            loadingItems: state.loadingItems.filter((id) => id !== guildId),
          }));
        }
      },

      muteFriend: async (userId: string) => {
        const token = get().token;
        const userDms = get().userDms;
        set((state) => ({ loadingItems: [...state.loadingItems, userId] }));

        try {
          const dmChannel = userDms.find(
            (dm) => dm.type === 1 && dm.recipients.some((recipient) => recipient.id === userId)
          );

          if (!dmChannel) {
            toast.error('No DM channel found for this friend to mute.');
            return false;
          }

          const payload = {
            channel_overrides: [
              {
                channel_id: dmChannel.id,
                muted: true,
                mute_config: {
                  selected_time_window: -1,
                  end_time: null,
                },
              },
            ],
          };

          const response = await fetch('https://discord.com/api/v9/users/@me/settings', {
            method: 'PATCH',
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            toast.success('Successfully muted friend!');
            return true;
          } else {
            toast.error('Failed to mute friend.');
            return false;
          }
        } catch (error) {
          console.error('Error muting friend:', error);
          return false;
        } finally {
          set((state) => ({
            loadingItems: state.loadingItems.filter((id) => id !== userId),
          }));
        }
      },

      handleDeleteSelected: async () => {
        const { servers, friends, dms } = get().selectedItems;
        const totalCount = servers.length + friends.length + dms.length;

        if (totalCount === 0) {
          toast.info('No items selected for deletion.');
          return;
        }

        set({ isLoading: true, deletionProgress: { deleted: 0, total: totalCount } });
        toast.info(`Starting to delete ${totalCount} selected items...`);

        let deletedCount = 0;
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        for (const guildId of servers) {
          const success = await get().leaveServer(guildId);
          if (success) {
            deletedCount++;
            set({ deletionProgress: { deleted: deletedCount, total: totalCount } });
          }
          await delay(1000);
        }

        for (const userId of friends) {
          const success = await get().removeFriend(userId);
          if (success) {
            deletedCount++;
            set({ deletionProgress: { deleted: deletedCount, total: totalCount } });
          }
          await delay(1000);
        }

        for (const channelId of dms) {
          const success = await get().closeDm(channelId);
          if (success) {
            deletedCount++;
            set({ deletionProgress: { deleted: deletedCount, total: totalCount } });
          }
          await delay(1000);
        }

        set({
          selectedItems: {
            servers: [],
            friends: [],
            dms: [],
            mutes: [],
            friendMutes: [],
          },
          isLoading: false,
        });
        toast.success('Finished deleting selected items.');
        setTimeout(() => set({ deletionProgress: { deleted: 0, total: 0 } }), 2000);
      },

      handleMuteSelected: async () => {
        const { mutes } = get().selectedItems;
        const totalCount = mutes.length;

        if (totalCount === 0) {
          toast.info('No servers selected for muting.');
          return;
        }

        set({ isLoading: true, deletionProgress: { deleted: 0, total: totalCount } });
        toast.info(`Starting to mute ${totalCount} selected servers...`);

        let mutedCount = 0;
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        for (const guildId of mutes) {
          const success = await get().muteServer(guildId);
          if (success) {
            mutedCount++;
            set({ deletionProgress: { deleted: mutedCount, total: totalCount } });
          }
          await delay(1000);
        }

        set((state) => ({
          selectedItems: { ...state.selectedItems, mutes: [] },
          isLoading: false,
        }));
        toast.success('Finished muting selected servers.');
        setTimeout(() => set({ deletionProgress: { deleted: 0, total: 0 } }), 2000);
      },

      handleMuteFriendsSelected: async () => {
        const { friendMutes } = get().selectedItems;
        const totalCount = friendMutes.length;

        if (totalCount === 0) {
          toast.info('No friends selected for muting.');
          return;
        }

        set({ isLoading: true, deletionProgress: { deleted: 0, total: totalCount } });
        toast.info(`Starting to mute ${totalCount} selected friends...`);

        let mutedCount = 0;
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        for (const userId of friendMutes) {
          const success = await get().muteFriend(userId);
          if (success) {
            mutedCount++;
            set({ deletionProgress: { deleted: mutedCount, total: totalCount } });
          }
          await delay(1000);
        }

        set((state) => ({
          selectedItems: { ...state.selectedItems, friendMutes: [] },
          isLoading: false,
        }));
        toast.success('Finished muting selected friends.');
        setTimeout(() => set({ deletionProgress: { deleted: 0, total: 0 } }), 2000);
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);

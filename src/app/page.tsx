"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { setCookie, getCookie } from "cookies-next";
import { toast } from "sonner";

interface Guild {
  id: string;
  name: string;
}

interface Relationship {
  id: string;
  type: number;
  user: {
    id: string;
    username: string;
    discriminator: string;
  };
}

export default function Page() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGuilds, setUserGuilds] = useState<Guild[]>([]);
  const [userFriends, setUserFriends] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(() => {
    document.cookie =
      "discord_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setUserGuilds([]);
    setUserFriends([]);
    setToken("");
  }, []);

  const fetchUserData = useCallback(
    async (userToken: string) => {
      try {
        // Fetch user's guilds
        const guildsResponse = await fetch(
          "https://discord.com/api/users/@me/guilds",
          {
            headers: {
              Authorization: userToken,
            },
          }
        );
        if (guildsResponse.status === 401) {
          toast.error("Invalid token. You'll have to log in again.");
          handleLogout();
        }
        if (guildsResponse.ok) {
          const guilds = await guildsResponse.json();
          setUserGuilds(guilds);
        } else throw new Error("Failed to fetch user guilds");

        // Fetch user's friends (relationships)
        const friendsResponse = await fetch(
          "https://discord.com/api/users/@me/relationships",
          {
            headers: {
              Authorization: userToken,
            },
          }
        );

        if (friendsResponse.ok) {
          const relationships = await friendsResponse.json();
          const friends = relationships.filter(
            (rel: Relationship) => rel.type === 1
          ); // Type 1 = friends
          setUserFriends(friends);
        } else throw new Error("Failed to fetch user friends");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [handleLogout]
  );

  // Load token from cookies on component mount
  useEffect(() => {
    const savedToken = getCookie("discord_token");
    if (savedToken) {
      setToken(savedToken as string);
      setIsAuthenticated(true);
      fetchUserData(savedToken as string);
    }
  }, [fetchUserData]);

  const handleTokenSave = async () => {
    if (!token.trim()) {
      toast.error("Please enter a Discord token");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        setCookie("discord_token", token, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          secure: true,
          sameSite: "strict",
        });
        setIsAuthenticated(true);
        toast.success("Token saved successfully!");
        fetchUserData(token);
      } else {
        toast.error("Invalid token. Please check your Discord token.");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("Error verifying token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveServer = async (guildId: string) => {
    try {
      const response = await fetch(
        `https://discord.com/api/users/@me/guilds/${guildId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`Successfully left server!`);
        fetchUserData(token); // Refresh data
      } else {
        toast.error("Failed to leave server.");
      }
    } catch (error) {
      console.error("Error leaving server:", error);
      toast.error("Error leaving server.");
    }
  };

  const removeFriend = async (userId: string) => {
    try {
      const response = await fetch(
        `https://discord.com/api/users/@me/relationships/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`Successfully removed friend!`);
        fetchUserData(token); // Refresh data
      } else {
        toast.error("Failed to remove friend.");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Error removing friend.");
    }
  };

  const defaultTab = isAuthenticated ? "servers" : "auth";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="auth">Discord Token</TabsTrigger>
            <TabsTrigger value="servers">
              Servers ({userGuilds.length})
            </TabsTrigger>
            <TabsTrigger value="friends">
              Friends ({userFriends.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle>Discord Token</CardTitle>
                <CardDescription>
                  Enter your Discord token to clean up your account. This runs
                  completely in your browser - your token never touches our
                  servers.
                </CardDescription>
              </CardHeader>
              {!isAuthenticated ? (
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="discord-token">Discord Token</Label>
                    <Input
                      id="discord-token"
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Enter your Discord token"
                    />
                    <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded">
                      <strong>Security Note:</strong> Your token is stored only
                      in your browser&apos;s cookies and is never sent to our
                      servers. All Discord API calls happen directly from your
                      browser to Discord.
                    </div>
                  </div>
                </CardContent>
              ) : null}
              <CardFooter>
                {!isAuthenticated ? (
                  <Button onClick={handleTokenSave} disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify and save"}
                  </Button>
                ) : (
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="servers">
            <Card>
              <CardHeader>
                <CardTitle>Your Servers</CardTitle>
                <CardDescription>
                  Leave servers you no longer want to be part of.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userGuilds.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {userGuilds.map((guild: Guild) => (
                      <div
                        key={guild.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <div className="font-medium">{guild.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {guild.id}
                          </div>
                        </div>
                        <Button
                          onClick={() => leaveServer(guild.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Leave
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {isAuthenticated
                      ? "No servers found"
                      : "Please authenticate first"}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle>Your Friends</CardTitle>
                <CardDescription>
                  Remove friends you no longer want to keep.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userFriends.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {userFriends.map((friend: Relationship) => (
                      <div
                        key={friend.user.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <div className="font-medium">
                            {friend.user.username}#{friend.user.discriminator}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {friend.user.id}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeFriend(friend.user.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {isAuthenticated
                      ? "No friends found"
                      : "Please authenticate first"}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

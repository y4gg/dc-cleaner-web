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
import { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";

export default function Page() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGuilds, setUserGuilds] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load token from cookies on component mount
  useEffect(() => {
    const savedToken = getCookie("discord_token");
    if (savedToken) {
      setToken(savedToken as string);
      setIsAuthenticated(true);
      fetchUserData(savedToken as string);
    }
  }, []);

  const fetchUserData = async (userToken: string) => {
    try {
      // Fetch user's guilds
      const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: userToken,
        },
      });
      console.log(guildsResponse);
      if (guildsResponse.ok) {
        const guilds = await guildsResponse.json();
        setUserGuilds(guilds);
      }

      // Fetch user's friends (relationships)
      const friendsResponse = await fetch("https://discord.com/api/users/@me/relationships", {
        headers: {
          Authorization: userToken,
        },
      });
      
      if (friendsResponse.ok) {
        const relationships = await friendsResponse.json();
        const friends = relationships.filter((rel: any) => rel.type === 1); // Type 1 = friends
        setUserFriends(friends);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleTokenSave = async () => {
    if (!token.trim()) {
      setMessage("Please enter a Discord token");
      return;
    }

    setIsLoading(true);
    setMessage("");

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
          sameSite: "strict"
        });
        setIsAuthenticated(true);
        setMessage("Token saved successfully!");
        fetchUserData(token);
      } else {
        setMessage("Invalid token. Please check your Discord token.");
      }
    } catch (error) {
      setMessage("Error verifying token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveServer = async (guildId: string) => {
    try {
      const response = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });
      
      if (response.ok) {
        setMessage(`Successfully left server!`);
        fetchUserData(token); // Refresh data
      } else {
        setMessage("Failed to leave server.");
      }
    } catch (error) {
      setMessage("Error leaving server.");
    }
  };

  const removeFriend = async (userId: string) => {
    try {
      const response = await fetch(`https://discord.com/api/users/@me/relationships/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });
      
      if (response.ok) {
        setMessage(`Successfully removed friend!`);
        fetchUserData(token); // Refresh data
      } else {
        setMessage("Failed to remove friend.");
      }
    } catch (error) {
      setMessage("Error removing friend.");
    }
  };

  const handleLogout = () => {
    document.cookie = "discord_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setUserGuilds([]);
    setUserFriends([]);
    setToken("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Tabs defaultValue="auth">
          <TabsList>
            <TabsTrigger value="auth">Discord Token</TabsTrigger>
            <TabsTrigger value="servers">Servers ({userGuilds.length})</TabsTrigger>
            <TabsTrigger value="friends">Friends ({userFriends.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle>Discord Token</CardTitle>
                <CardDescription>
                  Enter your Discord token to clean up your account. This runs completely in your browser - your token never touches our servers.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {!isAuthenticated ? (
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
                      <strong>Security Note:</strong> Your token is stored only in your browser's cookies and is never sent to our servers. 
                      All Discord API calls happen directly from your browser to Discord.
                    </div>
                  </div>
                ) : (
                  <div className="text-green-600 text-sm">
                    ✅ Authenticated with Discord
                  </div>
                )}
                {message && (
                  <div className={`text-sm ${message.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </div>
                )}
              </CardContent>
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
                    {userGuilds.map((guild: any) => (
                      <div key={guild.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{guild.name}</div>
                          <div className="text-sm text-gray-500">ID: {guild.id}</div>
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
                    {isAuthenticated ? "No servers found" : "Please authenticate first"}
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
                    {userFriends.map((friend: any) => (
                      <div key={friend.user.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{friend.user.username}#{friend.user.discriminator}</div>
                          <div className="text-sm text-gray-500">ID: {friend.user.id}</div>
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
                    {isAuthenticated ? "No friends found" : "Please authenticate first"}
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

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
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface AuthTabProps {
  isAuthenticated: boolean;
  token: string;
  setToken: (token: string) => void;
  isLoading: boolean;
  handleTokenSave: () => void;
  handleLogout: () => void;
  onRefetch?: () => void;
  isRefetching?: boolean;
  onSuccess?: () => void;
}

export function AuthTab({
  isAuthenticated,
  token,
  setToken,
  isLoading,
  handleTokenSave,
  handleLogout,
  onRefetch,
  isRefetching = false,
}: AuthTabProps) {
  return (
    <Card className={`flex flex-col ${isAuthenticated ? "h-full" : ""}`}>
      <CardHeader>
        <CardTitle>Discord Token</CardTitle>
        <CardDescription>
          Enter your Discord token to clean up your account. This runs completely
          in your browser - your token never leaves your browser.
        </CardDescription>
      </CardHeader>
      {!isAuthenticated && (
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
          </div>
        </CardContent>
      )}
      <CardFooter className="flex gap-2">
        {!isAuthenticated ? (
          <Button onClick={handleTokenSave} disabled={isLoading} className="text-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Verifying..." : "Verify and save"}
          </Button>
        ) : (
          <>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
            {onRefetch && (
              <Button 
                onClick={onRefetch} 
                variant="outline"
                disabled={isRefetching}
                className="text-foreground"
              >
                {isRefetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isRefetching ? "Refetching..." : "Refetch Data"}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}

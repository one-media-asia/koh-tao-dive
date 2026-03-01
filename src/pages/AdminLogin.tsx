This file has been removed to eliminate admin functionality.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { getAdminAccessConfig, hasAdminAccess } from '@/lib/adminAccess';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const adminAccessConfig = getAdminAccessConfig();

  useEffect(() => {
    // Check if already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && hasAdminAccess(user)) {
        navigate('/admin');
      } else if (user) {
        await supabase.auth.signOut();
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) throw error || new Error('Login failed');

      if (!hasAdminAccess(data.user)) {
        setError('Admin access required. Please contact support.');
        return;
      }

      const probeRes = await fetch('/api/bookings', {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (probeRes.status === 403) {
        setError('Backend admin access is not configured for this account. Please contact support.');
        return;
      }

      if (probeRes.status === 401) {
        setError('Session token is invalid for backend access. Please log in again or contact support.');
        return;
      }

      if (!probeRes.ok) {
        throw new Error('Admin API is unavailable');
      }

      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Supabase login error', error);
      const message = error instanceof Error ? error.message : 'Login failed';
      if (message === 'Admin access required') {
        toast.error('Login succeeded, but this account is not authorized for admin access.');
      } else if (message === 'Backend admin access is not configured for this account') {
        toast.error('Login succeeded, but backend admin allowlist is not configured. Set ADMIN_EMAILS on server and redeploy.');
      } else if (message === 'Session token is invalid for backend access') {
        toast.error('Login succeeded, but backend token validation failed. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on server.');
      } else if (message === 'Admin API is unavailable') {
        toast.error('Login succeeded, but admin API is unavailable.');
      } else {
        toast.error('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {adminAccessConfig.allowlistEnabled
                ? `Admin access: role=admin or email allowlist (${adminAccessConfig.allowlistCount} configured).`
                : 'Admin access: role=admin required.'}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

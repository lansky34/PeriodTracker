import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Users, Share2, Heart, Calendar, Bell, Shield, Link } from 'lucide-react';
import { ProFeatureGate } from './pro-feature-gate';
import { useState } from 'react';

export function PartnerSharing() {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    periodStart: true,
    moodChanges: false,
    fertileWindow: true,
    pmsSymptoms: true
  });

  const handleInvitePartner = () => {
    // Mock partner invitation
    console.log('Inviting partner:', partnerEmail);
  };

  return (
    <ProFeatureGate
      feature="Partner Sharing"
      description="Share your cycle information with your partner. Help them understand your needs and strengthen your relationship with better communication."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-6 h-6 mr-2 text-pink-500" />
            Partner Sharing
            <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Pro
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Partner Status */}
          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-lg">
            <div className="flex items-center mb-2">
              <Heart className="w-5 h-5 text-pink-500 mr-2" />
              <span className="font-medium text-sm">Strengthen Your Relationship</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Share key cycle information to help your partner understand your needs and provide better support.
            </p>
          </div>

          {/* Invite Partner */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Partner Access</h4>
                <p className="text-sm text-muted-foreground">Currently no partner connected</p>
              </div>
              <Switch 
                checked={sharingEnabled} 
                onCheckedChange={setSharingEnabled}
                disabled={!partnerEmail}
              />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Partner's email address"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                type="email"
              />
              <Button 
                onClick={handleInvitePartner}
                disabled={!partnerEmail}
                className="whitespace-nowrap"
              >
                <Link className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>

          {/* Sharing Settings */}
          {sharingEnabled && (
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                What to Share
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Period Start/End</p>
                      <p className="text-xs text-muted-foreground">Basic cycle timing</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.periodStart} 
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, periodStart: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-3 text-pink-500" />
                    <div>
                      <p className="text-sm font-medium">Fertile Window</p>
                      <p className="text-xs text-muted-foreground">Ovulation and fertility timing</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.fertileWindow} 
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, fertileWindow: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 mr-3 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">PMS Symptoms</p>
                      <p className="text-xs text-muted-foreground">When you need extra support</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.pmsSymptoms} 
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, pmsSymptoms: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Mood Changes</p>
                      <p className="text-xs text-muted-foreground">Emotional support needs</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.moodChanges} 
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, moodChanges: checked}))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Privacy Protected:</strong> Only the information you select is shared. Your partner receives helpful summaries, not detailed personal data. You can revoke access anytime.
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">How This Helps Your Relationship:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Your partner knows when to be extra supportive
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Better planning for date nights and activities
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Improved communication about your needs
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Synchronized family planning efforts
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </ProFeatureGate>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Activity, Smartphone, Watch, Scale, Moon, Heart, Zap, Wifi } from 'lucide-react';
import { ProFeatureGate } from './pro-feature-gate';
import { useState } from 'react';

interface HealthDevice {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  description: string;
  dataTypes: string[];
  color: string;
}

export function HealthIntegrations() {
  const [devices, setDevices] = useState<HealthDevice[]>([
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: Activity,
      connected: false,
      description: 'Sync steps, heart rate, sleep, and exercise data',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Exercise'],
      color: 'text-green-600'
    },
    {
      id: 'apple-health',
      name: 'Apple Health',
      icon: Heart,
      connected: false,
      description: 'Comprehensive health data from iPhone and Apple Watch',
      dataTypes: ['All Health Metrics', 'Workouts', 'Sleep', 'Weight'],
      color: 'text-red-600'
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      icon: Smartphone,
      connected: false,
      description: 'Samsung device health tracking integration',
      dataTypes: ['Activity', 'Sleep', 'Weight', 'Stress'],
      color: 'text-blue-600'
    },
    {
      id: 'garmin',
      name: 'Garmin',
      icon: Watch,
      connected: false,
      description: 'Advanced fitness and wellness metrics',
      dataTypes: ['Training', 'Recovery', 'Sleep', 'Stress'],
      color: 'text-indigo-600'
    },
    {
      id: 'withings',
      name: 'Withings',
      icon: Scale,
      connected: false,
      description: 'Smart scales and health monitoring devices',
      dataTypes: ['Weight', 'Body Composition', 'Sleep', 'Blood Pressure'],
      color: 'text-purple-600'
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      icon: Moon,
      connected: false,
      description: 'Advanced sleep and recovery tracking',
      dataTypes: ['Sleep Quality', 'HRV', 'Body Temperature', 'Activity'],
      color: 'text-gray-600'
    }
  ]);

  const handleToggleConnection = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: !device.connected }
        : device
    ));
  };

  const connectedCount = devices.filter(d => d.connected).length;

  return (
    <ProFeatureGate
      feature="Health Device Integration"
      description="Connect your fitness trackers, smart scales, and health apps to get comprehensive insights about how your cycle affects your overall health."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wifi className="w-6 h-6 mr-2 text-blue-500" />
            Health Device Integration
            <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Pro
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium text-sm">Connected Devices</span>
              </div>
              <Badge variant="secondary">{connectedCount}/{devices.length}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {connectedCount > 0 
                ? `Great! You have ${connectedCount} device${connectedCount > 1 ? 's' : ''} connected. Your cycle insights will be enriched with this health data.`
                : 'Connect your health devices to unlock deeper insights about how your cycle affects your sleep, exercise, and overall wellness.'
              }
            </p>
          </div>

          {/* Device List */}
          <div className="space-y-3">
            <h4 className="font-medium">Available Integrations</h4>
            {devices.map((device) => {
              const IconComponent = device.icon;
              return (
                <div key={device.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${device.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h5 className="font-medium text-sm">{device.name}</h5>
                        {device.connected && (
                          <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{device.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {device.dataTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={device.connected}
                    onCheckedChange={() => handleToggleConnection(device.id)}
                  />
                </div>
              );
            })}
          </div>

          {/* Benefits */}
          {connectedCount > 0 && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">What You'll Discover:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">How your cycle affects sleep quality and duration</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Exercise performance throughout your cycle</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Weight fluctuations and cycle correlation</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Stress levels and hormone impact</span>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start space-x-2">
              <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Privacy First:</strong> Your health data is encrypted and only used to provide personalized cycle insights. We never share your data with third parties. You can disconnect any device anytime.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProFeatureGate>
  );
}
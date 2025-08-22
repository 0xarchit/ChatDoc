import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BYOKConfig, DEFAULT_API_BASE_URL } from '@/lib/api';
import { storage } from '@/lib/storage';
import { Settings, Save, Trash2, Key, AlertTriangle, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  onUpdateBYOKKeys: (keys: BYOKConfig | null) => void;
  currentBYOKKeys: BYOKConfig | null;
}

interface SettingsForm {
  apiBaseUrl: string;
  enableBYOK: boolean;
  mistral_api_key: string;
  zilliz_uri: string;
  zilliz_token: string;
  collection_name: string;
}

export function SettingsModal({ onUpdateBYOKKeys, currentBYOKKeys }: SettingsModalProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<SettingsForm>({
    defaultValues: {
  apiBaseUrl: localStorage.getItem('apiBaseUrl') || DEFAULT_API_BASE_URL,
      enableBYOK: !!currentBYOKKeys,
      mistral_api_key: currentBYOKKeys?.mistral_api_key || '',
      zilliz_uri: currentBYOKKeys?.zilliz_uri || '',
      zilliz_token: currentBYOKKeys?.zilliz_token || '',
      collection_name: currentBYOKKeys?.collection_name || '',
    }
  });

  const enableBYOK = watch('enableBYOK');

  const onSubmit = (data: SettingsForm) => {
    // Save API base URL
    localStorage.setItem('apiBaseUrl', data.apiBaseUrl);

    // Handle BYOK keys
    if (data.enableBYOK) {
      const requiredFields = ['mistral_api_key', 'zilliz_uri', 'zilliz_token', 'collection_name'];
      const missingFields = requiredFields.filter(field => !data[field as keyof SettingsForm]);
      
      if (missingFields.length > 0) {
        toast.error('All BYOK fields are required when BYOK is enabled');
        return;
      }

      const byokKeys: BYOKConfig = {
        mistral_api_key: data.mistral_api_key,
        zilliz_uri: data.zilliz_uri,
        zilliz_token: data.zilliz_token,
        collection_name: data.collection_name,
      };

      storage.saveBYOKKeys(byokKeys);
      onUpdateBYOKKeys(byokKeys);
      toast.success('BYOK settings saved successfully');
    } else {
      storage.clearBYOKKeys();
      onUpdateBYOKKeys(null);
      toast.success('BYOK settings cleared');
    }

    toast.success('Settings saved successfully');
    setOpen(false);
  };

  const handleClearBYOK = () => {
    setValue('enableBYOK', false);
    setValue('mistral_api_key', '');
    setValue('zilliz_uri', '');
    setValue('zilliz_token', '');
    setValue('collection_name', '');
    
    storage.clearBYOKKeys();
    onUpdateBYOKKeys(null);
    toast.success('BYOK settings cleared');
  };

  const resetForm = () => {
    reset({
  apiBaseUrl: localStorage.getItem('apiBaseUrl') || DEFAULT_API_BASE_URL,
      enableBYOK: !!currentBYOKKeys,
      mistral_api_key: currentBYOKKeys?.mistral_api_key || '',
      zilliz_uri: currentBYOKKeys?.zilliz_uri || '',
      zilliz_token: currentBYOKKeys?.zilliz_token || '',
      collection_name: currentBYOKKeys?.collection_name || '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Application Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiBaseUrl">API Base URL</Label>
                <Input
                  id="apiBaseUrl"
                  {...register('apiBaseUrl', { required: 'API base URL is required' })}
                  placeholder={DEFAULT_API_BASE_URL || 'https://your-api.example.com'}
                />
                {errors.apiBaseUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.apiBaseUrl.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  The base URL for the ChatDoc API endpoints
                </p>
              </div>
            </CardContent>
          </Card>

          {/* BYOK Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5" />
                BYOK (Bring Your Own Keys)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableBYOK"
                  checked={enableBYOK}
                  onCheckedChange={(checked) => setValue('enableBYOK', !!checked)}
                />
                <Label htmlFor="enableBYOK">
                  Enable BYOK mode for enhanced security and data control
                </Label>
              </div>

              {enableBYOK && (
                <>
                  <Alert className="border-warning bg-warning/10">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Security Notice:</strong> Your keys are stored locally in your browser only. 
                      We cannot recover them if you clear your browser data. Documents uploaded with BYOK 
                      are protected from auto-deletion.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mistral_api_key">Mistral API Key *</Label>
                      <Input
                        id="mistral_api_key"
                        type="password"
                        {...register('mistral_api_key', { 
                          required: enableBYOK ? 'Mistral API key is required' : false 
                        })}
                        placeholder="Enter your Mistral API key"
                      />
                      {errors.mistral_api_key && (
                        <p className="text-sm text-destructive mt-1">{errors.mistral_api_key.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="collection_name_settings">Collection Name *</Label>
                      <Input
                        id="collection_name_settings"
                        {...register('collection_name', { 
                          required: enableBYOK ? 'Collection name is required' : false 
                        })}
                        placeholder="Enter collection name"
                      />
                      {errors.collection_name && (
                        <p className="text-sm text-destructive mt-1">{errors.collection_name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zilliz_uri">Zilliz URI *</Label>
                      <Input
                        id="zilliz_uri"
                        {...register('zilliz_uri', { 
                          required: enableBYOK ? 'Zilliz URI is required' : false 
                        })}
                        placeholder="Enter Zilliz URI"
                      />
                      {errors.zilliz_uri && (
                        <p className="text-sm text-destructive mt-1">{errors.zilliz_uri.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zilliz_token">Zilliz Token *</Label>
                      <Input
                        id="zilliz_token"
                        type="password"
                        {...register('zilliz_token', { 
                          required: enableBYOK ? 'Zilliz token is required' : false 
                        })}
                        placeholder="Enter Zilliz token"
                      />
                      {errors.zilliz_token && (
                        <p className="text-sm text-destructive mt-1">{errors.zilliz_token.message}</p>
                      )}
                    </div>
                  </div>

                  <Alert className="border-muted">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>How to obtain credentials:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Mistral API: Sign up at <a href="https://console.mistral.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">console.mistral.ai</a></li>
                        <li>Milvus/Zilliz: Get credentials from <a href="https://cloud.zilliz.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cloud.zilliz.com</a></li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {currentBYOKKeys && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearBYOK}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear BYOK Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
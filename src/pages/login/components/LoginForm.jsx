import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Only show demo credentials if explicitly enabled via environment variable
  // In production, set VITE_SHOW_DEMO_CREDENTIALS to 'false' or remove it
  const showDemoCredentials = import.meta.env?.VITE_SHOW_DEMO_CREDENTIALS !== 'false';

  const demoCredentials = showDemoCredentials ? [
    {
      email: 'admin@distributorhub.com',
      password: 'Admin@2026',
      role: 'Admin User'
    },
    {
      email: 'partner@techcorp.com',
      password: 'Partner@2026',
      role: 'Partner User'
    }
  ] : [];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    const { data, error } = await signIn(formData?.email, formData?.password);

    if (error) {
      setErrors({
        submit: error?.message || 'Invalid credentials. Please try again.'
      });
      setIsLoading(false);
    } else if (data?.user) {
      navigate('/executive-dashboard');
    }
  };

  const handleDemoLogin = (credentials) => {
    setFormData({
      email: credentials?.email,
      password: credentials?.password,
      rememberMe: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData?.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors?.email}
        required
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData?.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors?.password}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            checked={formData?.rememberMe}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, rememberMe: checked }))
            }
          />
          <label htmlFor="rememberMe" className="caption text-muted-foreground cursor-pointer">
            Remember me
          </label>
        </div>
        <a href="#" className="caption text-primary hover:text-primary/80 transition-smooth">
          Forgot password?
        </a>
      </div>
      {errors?.submit && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="caption text-error whitespace-pre-line">{errors?.submit}</p>
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Icon name="Loader2" size={18} className="animate-spin mr-2" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
      {demoCredentials?.length > 0 && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="caption text-muted-foreground mb-3 font-medium">Demo Credentials:</p>
          <div className="space-y-2">
            {demoCredentials?.map((cred, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDemoLogin(cred)}
                className="w-full text-left p-2 rounded hover:bg-muted transition-smooth"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="caption font-medium text-foreground">{cred?.role}</p>
                    <p className="caption text-muted-foreground">{cred?.email}</p>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default LoginForm;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';


const RegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    primaryCurrency: 'USD',
    financialGoals: [],
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'INR', label: 'Indian Rupee (INR)' }
  ];

  const goalOptions = [
    { value: 'emergency_fund', label: 'Build Emergency Fund' },
    { value: 'debt_payoff', label: 'Pay Off Debt' },
    { value: 'home_purchase', label: 'Save for Home Purchase' },
    { value: 'retirement', label: 'Retirement Planning' },
    { value: 'investment', label: 'Investment Growth' },
    { value: 'vacation', label: 'Vacation Fund' },
    { value: 'education', label: 'Education Expenses' },
    { value: 'business', label: 'Start a Business' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Password strength validation
    if (field === 'password') {
      validatePasswordStrength(value);
    }
  };

  const validatePasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password?.length >= 8) {
      score += 1;
    } else {
      feedback?.push('At least 8 characters');
    }

    if (/[A-Z]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One uppercase letter');
    }

    if (/[a-z]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One lowercase letter');
    }

    if (/\d/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push('One special character');
    }

    setPasswordStrength({ score, feedback });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.fullName?.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (passwordStrength?.score < 3) {
        newErrors.password = 'Password is too weak';
      }

      if (!formData?.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!formData?.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms of service';
      }

      if (!formData?.agreeToPrivacy) {
        newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep(2)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', formData);
      
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength?.score <= 1) return 'bg-destructive';
    if (passwordStrength?.score <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength?.score <= 1) return 'Weak';
    if (passwordStrength?.score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of 2
          </span>
          <span className="text-sm text-muted-foreground">
            {currentStep === 1 ? 'Account Details' : 'Preferences & Terms'}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              description="We'll use this for account verification and important updates"
              required
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
                required
              />
              
              {formData?.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Password strength:
                    </span>
                    <span className={`text-sm font-medium ${
                      passwordStrength?.score <= 1 ? 'text-destructive' :
                      passwordStrength?.score <= 3 ? 'text-warning' : 'text-success'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                    />
                  </div>
                  {passwordStrength?.feedback?.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Missing: {passwordStrength?.feedback?.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              required
            />

            <Button
              type="button"
              variant="default"
              onClick={handleNextStep}
              fullWidth
              iconName="ArrowRight"
              iconPosition="right"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Preferences and Terms */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Select
              label="Primary Currency"
              description="This will be your default currency for all transactions"
              options={currencyOptions}
              value={formData?.primaryCurrency}
              onChange={(value) => handleInputChange('primaryCurrency', value)}
              id="primaryCurrency"
              name="primaryCurrency"
              error=""
            />

            <Select
              label="Financial Goals (Optional)"
              description="Select your main financial objectives to get personalized insights"
              options={goalOptions}
              value={formData?.financialGoals}
              onChange={(value) => handleInputChange('financialGoals', value)}
              multiple
              searchable
              placeholder="Choose your financial goals"
              id="financialGoals"
              name="financialGoals"
              error=""
            />

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="text-sm font-semibold text-foreground">
                Terms and Privacy
              </h3>
              
              <Checkbox
                label="I agree to the Terms of Service"
                checked={formData?.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
                error={errors?.agreeToTerms}
                id="agreeToTerms"
                name="agreeToTerms"
                value={formData?.agreeToTerms}
                description={
                  <span>
                    By checking this, you agree to our{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                  </span>
                }
              />

              <Checkbox
                label="I agree to the Privacy Policy"
                checked={formData?.agreeToPrivacy}
                onChange={(e) => handleInputChange('agreeToPrivacy', e?.target?.checked)}
                error={errors?.agreeToPrivacy}
                id="agreeToPrivacy"
                name="agreeToPrivacy"
                value={formData?.agreeToPrivacy}
                description={
                  <span>
                    Read our{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    to understand how we protect your data
                  </span>
                }
              />
            </div>

            {errors?.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{errors?.submit}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back
              </Button>
              
              <Button
                type="submit"
                variant="default"
                loading={isSubmitting}
                disabled={!formData?.agreeToTerms || !formData?.agreeToPrivacy}
                fullWidth
                iconName="UserPlus"
                iconPosition="left"
              >
                Create Account
              </Button>
            </div>
          </div>
        )}
      </form>
      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Dog,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight
} from 'lucide-react';

export const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      await register(formData);

      showToast(
        'Account registered successfully!',
        'success'
      );

      navigate('/dashboard');

    } catch (err) {

      showToast(
        err.response?.data?.message ||
        'Registration failed. Try another email.',
        'error'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top left, rgba(139, 92, 246, 0.15), transparent 40%), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.15), transparent 40%), var(--bg-dark)',
        padding: '2rem'
      }}
    >

      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem'
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.8rem'
          }}
        >

          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background:
                'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow:
                '0 8px 25px var(--secondary-glow)'
            }}
          >

            <Dog
              size={30}
              color="#ffffff"
            />

          </div>

          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 800
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              marginTop: '0.2rem'
            }}
          >
            Create your PetCarePro owner account
          </p>

        </div>

        {/* REGISTRATION FORM */}

        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}

          <div className="form-group">

            <label>Full Name</label>

            <div style={{ position: 'relative' }}>

              <input
                type="text"
                required
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
                style={{
                  paddingLeft: '2.5rem'
                }}
              />

              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />

            </div>

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label>Email Address</label>

            <div style={{ position: 'relative' }}>

              <input
                type="email"
                required
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
                style={{
                  paddingLeft: '2.5rem'
                }}
              />

              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>Password</label>

            <div style={{ position: 'relative' }}>

              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                }
                style={{
                  paddingLeft: '2.5rem'
                }}
              />

              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />

            </div>

          </div>

          {/* PHONE */}

          <div className="form-group">

            <label>Phone Number</label>

            <div style={{ position: 'relative' }}>

              <input
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                }
                style={{
                  paddingLeft: '2.5rem'
                }}
              />

              <Phone
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />

            </div>

          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              marginTop: '0.5rem'
            }}
          >

            {loading
              ? 'Creating Account...'
              : 'Register Account'
            }

            <ArrowRight size={18} />

          </button>

        </form>

        {/* LOGIN LINK */}

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.88rem',
            color: 'var(--text-muted)'
          }}
        >

          Already registered?{' '}

          <Link
            to="/login"
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            Sign In Here
          </Link>

        </div>

      </div>

    </div>
  );
};
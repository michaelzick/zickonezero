import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import { Wrapper } from '../../styles';
import {
  AnimatedSection,
  HeroLabel,
  PageInner,
  PageShell,
  Summary,
  Title,
} from '../../styles/projectShowcases';
import {
  ContactActions,
  ContactField,
  ContactForm,
  ContactGrid,
  ContactHoneypot,
  ContactIntro,
  ContactStatus,
  ContactSubmit,
  ContactSuccess,
} from '../../styles/contact';
import { TopNavContent, FooterContent } from '.';
import { useAppDispatch, useAppSelector } from '../hooks';
import { trackEvent } from '../lib/analytics';
import {
  EMPTY_CONTACT_FORM,
  getContactValidationError,
  submitContactForm,
  type ContactFormValues,
} from '../lib/contactForm';
import { getMobileMenuState, showMobileMenu } from '../showMobileMenuSlice';
import TrackedLink from './TrackedLink';

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

const ContactContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<ContactFormValues>(EMPTY_CONTACT_FORM);
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  // Abort an in-flight submission if the page unmounts mid-request.
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (!(name in EMPTY_CONTACT_FORM)) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === 'submitting') return;

    const validationError = getContactValidationError(values);
    if (validationError) {
      setStatus({ kind: 'error', message: validationError });
      return;
    }

    trackEvent('contact_form_submit_started', { page_path: window.location.pathname });
    setStatus({ kind: 'submitting' });

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await submitContactForm(values, controller.signal);
      if (controller.signal.aborted) return;

      if (result.ok) {
        trackEvent('contact_form_submit_succeeded', { page_path: window.location.pathname });
        setValues(EMPTY_CONTACT_FORM);
        setStatus({ kind: 'success' });
        return;
      }

      trackEvent('contact_form_submit_failed', {
        failure_reason: result.reason,
        error_message: result.message,
        page_path: window.location.pathname,
      });
      setStatus({ kind: 'error', message: result.message });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      throw error;
    }
  };

  const isSubmitting = status.kind === 'submitting';

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown} isAtPage $isProjectPage
        onClick={() => dispatch(showMobileMenu(false))}>
        <PageShell>
          <PageInner>
            <AnimatedSection className='visible'>
              <ContactGrid>
                <ContactIntro className='text-animate'>
                  <Title>Contact</Title>
                  <div>
                    <HeroLabel>Let’s talk</HeroLabel>
                    <Summary>
                      Have a product, UX, or engineering problem worth solving? Send a note and I’ll reply
                      within a couple of days.
                    </Summary>
                  </div>
                  <p>
                    You can also find me on{' '}
                    <TrackedLink href='https://linkedin.com/in/michaelzick' label='LinkedIn' location='contact_page'
                      section='intro' target='_blank' rel='noopener noreferrer'>LinkedIn</TrackedLink>{' '}
                    and{' '}
                    <TrackedLink href='https://github.com/michaelzick' label='GitHub' location='contact_page'
                      section='intro' target='_blank' rel='noopener noreferrer'>GitHub</TrackedLink>.
                  </p>
                </ContactIntro>

                {status.kind === 'success' ? (
                  <ContactSuccess role='status' className='image-animate'>
                    <h2>Message sent</h2>
                    <p>Thanks for reaching out. I’ll get back to you within 48 hours.</p>
                  </ContactSuccess>
                ) : (
                  <ContactForm className='image-animate' onSubmit={handleSubmit} noValidate aria-label='Contact form'>
                    <ContactField>
                      <label htmlFor='contact-name'>Name</label>
                      <input
                        id='contact-name'
                        name='name'
                        type='text'
                        autoComplete='name'
                        placeholder='Your name'
                        value={values.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                      />
                    </ContactField>

                    <ContactField>
                      <label htmlFor='contact-email'>Email</label>
                      <input
                        id='contact-email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        placeholder='you@example.com'
                        value={values.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                      />
                    </ContactField>

                    <ContactField>
                      <label htmlFor='contact-message'>Message</label>
                      <textarea
                        id='contact-message'
                        name='message'
                        placeholder='What are you working on?'
                        value={values.message}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                      />
                    </ContactField>

                    <ContactHoneypot aria-hidden='true'>
                      <label htmlFor='contact-website'>Website</label>
                      <input
                        id='contact-website'
                        name='website'
                        type='text'
                        tabIndex={-1}
                        autoComplete='off'
                        value={values.website}
                        onChange={handleChange}
                      />
                    </ContactHoneypot>

                    {status.kind === 'error' ? (
                      <ContactStatus role='alert' $tone='error'>{status.message}</ContactStatus>
                    ) : null}

                    <ContactActions>
                      <ContactSubmit type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Send message'}
                      </ContactSubmit>
                    </ContactActions>
                  </ContactForm>
                )}
              </ContactGrid>
            </AnimatedSection>
          </PageInner>
        </PageShell>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default ContactContent;

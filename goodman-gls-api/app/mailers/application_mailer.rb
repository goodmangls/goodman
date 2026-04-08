class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("CONTACT_EMAIL_FROM", "noreply@goodmangls.com")
  layout "mailer"
end

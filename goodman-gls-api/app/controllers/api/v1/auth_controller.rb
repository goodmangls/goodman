module Api
  module V1
    class AuthController < ApplicationController
      include JwtAuthenticatable

      # POST /api/v1/auth/register
      def register
        user = User.new(register_params)

        if user.save
          UserMailer.verification(user).deliver_later
          token = encode_token(user)
          render json: { token: token, refresh_token: encode_refresh_token(user), user: user_json(user) }, status: :created
        else
          render json: { error: { code: "VALIDATION_ERROR", message: user.errors.full_messages.join(", ") } }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: params[:email]&.downcase&.strip)

        unless user&.authenticate(params[:password])
          return render json: { error: { code: "UNAUTHORIZED", message: "Invalid email or password" } }, status: :unauthorized
        end

        if user.status == "pending"
          return render json: { error: { code: "UNVERIFIED", message: "Please verify your email first" } }, status: :forbidden
        end

        if user.status.in?(%w[suspended inactive])
          return render json: { error: { code: "ACCOUNT_DISABLED", message: "Account is disabled" } }, status: :forbidden
        end

        token = encode_token(user)
        render json: { token: token, refresh_token: encode_refresh_token(user), user: user_json(user) }
      end

      # GET /api/v1/auth/me
      def me
        authenticate_user!
        return if performed?
        render json: user_json(current_user)
      end

      # POST /api/v1/auth/refresh
      def refresh
        user = decode_refresh_token(params[:refresh_token])
        if user
          render json: { token: encode_token(user), refresh_token: encode_refresh_token(user), user: user_json(user) }
        else
          render json: { error: { code: "INVALID_TOKEN", message: "Invalid or expired refresh token" } }, status: :unauthorized
        end
      end

      # POST /api/v1/auth/verify-email
      def verify_email
        user = User.find_by(email_verification_token: params[:token])

        unless user
          return render json: { error: { code: "INVALID_TOKEN", message: "Invalid verification token" } }, status: :unprocessable_entity
        end

        user.update!(status: "active", email_verified_at: Time.current, email_verification_token: nil)
        render json: { message: "Email verified successfully" }
      end

      # POST /api/v1/auth/forgot-password
      def forgot_password
        user = User.find_by(email: params[:email]&.downcase&.strip)
        if user
          user.update!(
            password_reset_token: SecureRandom.urlsafe_base64(32),
            password_reset_sent_at: Time.current
          )
          UserMailer.password_reset(user).deliver_later
        end
        # Always return success to prevent email enumeration
        render json: { message: "If the email exists, a reset link has been sent" }
      end

      # POST /api/v1/auth/reset-password
      def reset_password
        user = User.find_by(password_reset_token: params[:token])

        unless user && user.password_reset_sent_at > 2.hours.ago
          return render json: { error: { code: "INVALID_TOKEN", message: "Invalid or expired reset token" } }, status: :unprocessable_entity
        end

        if params[:password].blank? || params[:password] != params[:password_confirmation]
          return render json: { error: { code: "VALIDATION_ERROR", message: "Password confirmation does not match" } }, status: :unprocessable_entity
        end

        user.update!(password: params[:password], password_reset_token: nil, password_reset_sent_at: nil)
        render json: { message: "Password reset successfully" }
      end

      private

      def register_params
        params.permit(:email, :password, :password_confirmation, :name)
      end
    end
  end
end

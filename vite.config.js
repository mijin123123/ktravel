import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        benefits: resolve(__dirname, 'benefits.html'),
        best: resolve(__dirname, 'best.html'),
        booking: resolve(__dirname, 'booking.html'),
        'booking-confirmation': resolve(__dirname, 'booking-confirmation.html'),
        community: resolve(__dirname, 'community.html'),
        'community-detail': resolve(__dirname, 'community-detail.html'),
        companion: resolve(__dirname, 'companion.html'),
        custom: resolve(__dirname, 'custom.html'),
        domestic: resolve(__dirname, 'domestic.html'),
        exhibitions: resolve(__dirname, 'exhibitions.html'),
        'flights-hotels': resolve(__dirname, 'flights-hotels.html'),
        flights: resolve(__dirname, 'flights.html'),
        golf: resolve(__dirname, 'golf.html'),
        hotels: resolve(__dirname, 'hotels.html'),
        live: resolve(__dirname, 'live.html'),
        login: resolve(__dirname, 'login.html'),
        'package-detail': resolve(__dirname, 'package-detail.html'),
        packages: resolve(__dirname, 'packages.html'),
        signup: resolve(__dirname, 'signup.html'),
        test: resolve(__dirname, 'test.html'),
        theme: resolve(__dirname, 'theme.html'),
        'tours-tickets': resolve(__dirname, 'tours-tickets.html'),
        zeus: resolve(__dirname, 'zeus.html'),
      },
    },
  },
})

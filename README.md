# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Project Front-End Tenangin

![Logo Tenangin](public/icons/LogoTenangin.png)

This project is the front-end application for Tenangin, a platform to find and save recommendations for psychologists nearby.

This project was initiated by Program Coding Camp powered by DBS Foundation 2025 and Dicoding.

## Features Implemented

- User location detection using Geolocation API.
- Fetching psychologist recommendations based on user location.
- Interactive map display with markers for psychologists using Leaflet.
- Saving psychologist recommendations with duplicate prevention.
- Server-side duplicate check before saving recommendations.
- Local state and localStorage synchronization for saved recommendations.
- Integration with backend API for authentication, profile, assessments, journals, clinics, chatbot, reminders, and recommendations.
- Responsive sidebar and UI components for a smooth user experience.
- Google Maps integration to open location in a new tab.
- Robust error handling and user feedback for API interactions.

## How to Run

1. Clone the repository.
2. Install dependencies using `npm install` or `yarn`.
3. Run the development server with `npm run dev` or `yarn dev`.
4. Open the application in your browser at the specified localhost URL.
5. Use the recommendation page to find and save psychologists.

## Notes

- The application uses React with Vite for fast development and build.
- Leaflet is used for map rendering and interaction.
- API endpoints are configured in `src/data/api/api.jsx`.
- Authentication tokens are managed and passed in API requests.
- LocalStorage is used to persist saved recommendations on the client side.

## Future Improvements

- Add user authentication and profile management UI.
- Enhance recommendation filtering and sorting options.
- Improve map marker clustering and performance.
- Add unit and integration tests for components and API interactions.
- Implement offline support and caching strategies.

---

For more details, refer to the source code and comments within the project files.

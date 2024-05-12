import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/home';
import { TournamentPage } from '../pages/tournament';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'tournament',
    element: <TournamentPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/home';
import { TournamentPage } from '../pages/tournament';
import { PracticePage } from '../pages/practice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'tournament',
    element: <TournamentPage />,
  },
  {
    path: '/practice',
    element: <PracticePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

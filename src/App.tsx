import { useState } from 'react';
import DashboardHome from './components/DashboardHome';
import CustomerListView from './components/CustomerListView';
import CustomerDetailDashboard from './components/CustomerDetailDashboard';
import { type MockUser } from './data/mockData';

type ViewState = 'HOME' | 'LIST' | 'DETAIL';

function App() {
  const [viewState, setViewState] = useState<ViewState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  const goToHome = () => {
    setViewState('HOME');
    setSelectedCategory('');
    setSelectedUser(null);
  };

  const goToList = (category: string) => {
    setSelectedCategory(category);
    setViewState('LIST');
  };

  const goToDetail = (user: MockUser) => {
    setSelectedUser(user);
    setViewState('DETAIL');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[1600px] mx-auto p-6 md:p-8">

        {viewState === 'HOME' && (
          <DashboardHome
            onCategorySelect={goToList}
            onUserSelect={goToDetail}
          />
        )}

        {viewState === 'LIST' && (
          <CustomerListView
            category={selectedCategory}
            onBack={goToHome}
            onUserSelect={goToDetail}
          />
        )}

        {viewState === 'DETAIL' && selectedUser && (
          <CustomerDetailDashboard
            user={selectedUser}
            onBack={goToHome} // Or go back to list? For now home is fine or we can track history.
          />
        )}

      </div>
    </div>
  );
}

export default App;

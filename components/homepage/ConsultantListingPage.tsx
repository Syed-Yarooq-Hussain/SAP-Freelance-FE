import { useState } from 'react';
import { Search, Filter, Star, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Consultant } from '@/app/page';

// interface Consultant {
//   id: number;
//   code: string;
//   module: string;
//   experienceLevel: string;
//   experienceYears: number;
//   rating: number;
//   availability: string;
//   skills: string[];
// }

// Generate anonymous consultant data
const generateConsultants = () => {
  const modules = ['FICO', 'MM', 'SD', 'ABAP', 'PP', 'QM', 'PM', 'WM', 'HCM', 'HANA', 'Basis', 'BW', 'CRM', 'SRM', 'SCM'];
  const experienceLevels = [
    { label: 'Junior', years: 3 },
    { label: 'Junior', years: 4 },
    { label: 'Mid-Level', years: 5 },
    { label: 'Mid-Level', years: 6 },
    { label: 'Mid-Level', years: 7 },
    { label: 'Mid-Level', years: 8 },
    { label: 'Mid-Level', years: 9 },
    { label: 'Senior', years: 10 },
    { label: 'Senior', years: 11 },
    { label: 'Senior', years: 12 },
    { label: 'Senior', years: 13 },
    { label: 'Senior', years: 15 },
    { label: 'Senior', years: 18 },
  ];
  const availabilities = ['Available', 'Partially Available', 'Not Available'];

  const consultants = [];
  for (let i = 0; i < 156; i++) {
    const exp = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
    const rating = (4.0 + Math.random() * 1.0).toFixed(1);
    consultants.push({
      id: i + 1,
      code: `C-${10000 + i}`,
      module: modules[Math.floor(Math.random() * modules.length)],
      experienceLevel: exp.label,
      experienceYears: exp.years,
      rating: parseFloat(rating),
      availability: availabilities[Math.floor(Math.random() * availabilities.length)],
      skills: ['S/4HANA', 'Implementation', 'Migration', 'Support'], // Hidden until detail page
      name: `Consultant ${i + 1}`,
    });
  }
  return consultants;
};

const allConsultants = generateConsultants();

interface ConsultantListingPageProps {
  onConsultantClick: (consultant: Consultant) => void;
}

export function ConsultantListingPage({ onConsultantClick }: ConsultantListingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const consultantsPerPage = 25;

  // Filter consultants
  const filteredConsultants = allConsultants.filter((consultant) => {
    const matchesSearch = searchQuery === '' || 
      consultant.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.module.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = !selectedModule || consultant.module === selectedModule;
    const matchesExperience = !selectedExperience || consultant.experienceLevel === selectedExperience;
    const matchesAvailability = !selectedAvailability || consultant.availability === selectedAvailability;
    const matchesRating = !selectedRating || consultant.rating >= parseFloat(selectedRating);

    return matchesSearch && matchesModule && matchesExperience && matchesAvailability && matchesRating;
  });

  // Pagination
  const totalPages = Math.ceil(filteredConsultants.length / consultantsPerPage);
  const startIndex = (currentPage - 1) * consultantsPerPage;
  const endIndex = startIndex + consultantsPerPage;
  const currentConsultants = filteredConsultants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedModule('');
    setSelectedExperience('');
    setSelectedAvailability('');
    setSelectedRating('');
    setCurrentPage(1);
  };

  const getAvailabilityStyle = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Partially Available':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Not Available':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAvailabilityDot = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-500';
      case 'Partially Available':
        return 'bg-yellow-500';
      case 'Not Available':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2">Browse SAP Consultants</h1>
              <p className="text-gray-600">
                Pre-vetted, confidential talent pool &mdash; {allConsultants.length} consultants available
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Active Consultants</div>
                <div className="text-xl text-blue-600">{allConsultants.filter(c => c.availability === 'Available').length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by consultant code or module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-3">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Modules</option>
                <option value="FICO">FICO</option>
                <option value="MM">MM</option>
                <option value="SD">SD</option>
                <option value="ABAP">ABAP</option>
                <option value="PP">PP</option>
                <option value="QM">QM</option>
                <option value="PM">PM</option>
                <option value="WM">WM</option>
                <option value="HCM">HCM</option>
                <option value="HANA">HANA</option>
                <option value="Basis">Basis</option>
                <option value="BW">BW</option>
                <option value="CRM">CRM</option>
                <option value="SRM">SRM</option>
                <option value="SCM">SCM</option>
              </select>

              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Experience</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>

              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Availability</option>
                <option value="Available">Available</option>
                <option value="Partially Available">Partially Available</option>
                <option value="Not Available">Not Available</option>
              </select>

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Modules</option>
                <option value="FICO">FICO</option>
                <option value="MM">MM</option>
                <option value="SD">SD</option>
                <option value="ABAP">ABAP</option>
                <option value="PP">PP</option>
                <option value="QM">QM</option>
                <option value="PM">PM</option>
                <option value="WM">WM</option>
                <option value="HCM">HCM</option>
                <option value="HANA">HANA</option>
                <option value="Basis">Basis</option>
                <option value="BW">BW</option>
                <option value="CRM">CRM</option>
                <option value="SRM">SRM</option>
                <option value="SCM">SCM</option>
              </select>

              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Experience</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>

              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Availability</option>
                <option value="Available">Available</option>
                <option value="Partially Available">Partially Available</option>
                <option value="Not Available">Not Available</option>
              </select>

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          )}

          {/* Active Filters & Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredConsultants.length)}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredConsultants.length}</span> consultants
            </div>
            {(searchQuery || selectedModule || selectedExperience || selectedAvailability || selectedRating) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Consultant List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm text-gray-600">
              <div className="col-span-2">Consultant Code</div>
              <div className="col-span-2">SAP Module</div>
              <div className="col-span-2">Experience</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-3">Availability</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {currentConsultants.length > 0 ? (
              currentConsultants.map((consultant) => (
                <button
                  key={consultant.id}
                  onClick={() => onConsultantClick(consultant)}
                  className="w-full px-6 py-5 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="grid grid-cols-12 gap-4 items-center text-left">
                    {/* Consultant Code */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs">
                          {consultant.code.split('-')[1].slice(-2)}
                        </div>
                        <span className="text-blue-600 group-hover:text-blue-700">{consultant.code}</span>
                      </div>
                    </div>

                    {/* SAP Module */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                        SAP {consultant.module}
                      </span>
                    </div>

                    {/* Experience */}
                    <div className="col-span-2">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{consultant.experienceLevel}</span>
                        <span className="text-xs text-gray-500">{consultant.experienceYears} years</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-900">{consultant.rating}</span>
                        <span className="text-gray-400">/5.0</span>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="col-span-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getAvailabilityStyle(consultant.availability)}`}>
                        <div className={`w-2 h-2 rounded-full ${getAvailabilityDot(consultant.availability)} animate-pulse`} />
                        <span className="text-sm">{consultant.availability}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 flex justify-end">
                      <div className="text-blue-600 group-hover:text-blue-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        View →
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No consultants found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show first page, last page, current page, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg border transition-all ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
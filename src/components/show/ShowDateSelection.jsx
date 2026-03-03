// components/show/ShowDateSelection.jsx
"use client";
import { Calendar, ChevronRight } from 'lucide-react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import useUserShowBookingStore from '@/lib/stores/useUserShowBooking';

export default function ShowDateSelection() {
  const { selectedDate, setDateAndShift, showSettings } = useUserShowBookingStore();

  // Generate dates based on settings
  const generateAvailableDates = () => {
    const eventDates = showSettings?.eventDates;
    const today = startOfToday();
    
    if (eventDates?.startDate && eventDates?.endDate) {
      const startDate = new Date(eventDates.startDate);
      const endDate = new Date(eventDates.endDate);
      const dates = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    }
    
    // Fallback to configured availableDays (default 5)
    const availableDays = Number(eventDates?.availableDays) || 5;
    return Array.from({ length: availableDays }, (_, i) => addDays(today, i + 1));
  };

  const availableDates = generateAvailableDates();
  
  const activeShows = showSettings?.shows?.filter(
    (show) => show?.active === true || show?.isActive === true
  ) || [];

  const handleDateSelect = (date) => {
    const firstShow = activeShows.length > 0 ? 
      (activeShows[0].name || 'evening').toLowerCase() : 
      'evening';
    setDateAndShift(date, firstShow);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    const selectedDateObj = typeof selectedDate === 'string' 
      ? new Date(selectedDate) 
      : selectedDate;
    return isSameDay(date, selectedDateObj);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
          Choose Your Show Date
        </h2>
        <p className="text-gray-600">Select your preferred date for the show</p>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-4">
        {availableDates.map((date, index) => {
          const isSelected = isDateSelected(date);

          return (
            <div
              key={index}
              className={`group relative w-full max-w-[190px] p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 border-2 border-rose-400 shadow-xl scale-[1.03]"
                  : "bg-gradient-to-br from-white via-rose-50/70 to-pink-50/70 border border-rose-200 hover:border-rose-300 hover:shadow-lg"
              }`}
              onClick={() => handleDateSelect(date)}
            >
              <div className="flex items-center justify-center mb-3">
                <Calendar className={`w-5 h-5 mr-2 ${isSelected ? "text-pink-600" : "text-gray-400"}`} />
                <span className={`text-sm font-medium ${isSelected ? "text-pink-600" : "text-gray-500"}`}>
                  Day {index + 1}
                </span>
              </div>

              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${isSelected ? "text-pink-700" : "text-gray-700"}`}>
                  {format(date, "EEEE")}
                </div>
                <div className={`text-sm ${isSelected ? "text-pink-600" : "text-gray-500"}`}>
                  {format(date, "MMMM dd")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && activeShows.length > 0 && (
        <div className="mt-8 space-y-4">
          {activeShows.map((show, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-pink-600 text-3xl">{show.icon || '🎭'}</span>
                  <div>
                    <p className="text-lg font-semibold text-pink-700">{show.name}</p>
                    <p className="text-sm text-pink-600">
                      {formatTime(show.timeFrom || show.startTime)} - {formatTime(show.timeTo || show.endTime)}
                    </p>
                  </div>
                </div>
                <span className="px-4 py-1 bg-pink-200 text-pink-700 rounded-full text-sm font-medium">
                  {show.badgeText || 'Daily Show'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                {show.description || 'Join us for an unforgettable cultural experience.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

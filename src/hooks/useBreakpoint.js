import { useEffect, useState } from 'react';

const TABLET_MAX_WIDTH = 1199;
const MOBILE_MAX_WIDTH = 743;

const COLUMNS = {
  mobile: 2,
  tablet: 2,
  desktop: 3,
};

const ROWS = {
  mobile: 6,
  tablet: 6,
  desktop: 4,
};

function getDeviceType(width) {
  if (width <= MOBILE_MAX_WIDTH) return 'mobile';
  if (width <= TABLET_MAX_WIDTH) return 'tablet';
  return 'desktop';
}

export default function useBreakpoint() {
  const [device, setDevice] = useState(() =>
    typeof window === 'undefined' ? 'desktop' : getDeviceType(window.innerWidth)
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`);

    const updateDevice = () => {
      if (mobileQuery.matches) {
        setDevice('mobile');
      } else if (tabletQuery.matches) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    updateDevice();

    mobileQuery.addEventListener('change', updateDevice);
    tabletQuery.addEventListener('change', updateDevice);

    return () => {
      mobileQuery.removeEventListener('change', updateDevice);
      tabletQuery.removeEventListener('change', updateDevice);
    };
  }, []);

  const columns = COLUMNS[device];
  const rows = ROWS[device];

  return {
    device,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    columns,
    rows,
    pageSize: columns * rows,
  };
}

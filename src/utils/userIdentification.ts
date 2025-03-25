import { v4 as uuidv4 } from 'uuid';
import { identifyUser } from './analytics';

const ANONYMOUS_ID_KEY = 'anonymousId';
const SESSION_ID_KEY = 'sessionId';

interface UserTraits {
  firstSeen: string;
  lastSeen: string;
  sessionCount: number;
  deviceType: string;
  browserInfo: string;
}

export function getAnonymousId(): string {
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  
  if (!anonymousId) {
    anonymousId = `anon_${uuidv4()}`;
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
    
    // Store first seen timestamp
    localStorage.setItem('firstSeen', new Date().toISOString());
    localStorage.setItem('sessionCount', '1');
  }
  
  return anonymousId;
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    sessionId = `session_${uuidv4()}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    
    // Increment session count
    const sessionCount = Number(localStorage.getItem('sessionCount') || '0');
    localStorage.setItem('sessionCount', (sessionCount + 1).toString());
  }
  
  return sessionId;
}

export function identifyAnonymousUser(): void {
  const anonymousId = getAnonymousId();
  const sessionId = getSessionId();
  
  const traits: UserTraits = {
    firstSeen: localStorage.getItem('firstSeen') || new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    sessionCount: Number(localStorage.getItem('sessionCount') || '1'),
    deviceType: getDeviceType(),
    browserInfo: getBrowserInfo()
  };
  
  identifyUser(anonymousId, {
    ...traits,
    sessionId,
    isAnonymous: true
  });
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  const browserRegexes = [
    { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
    { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
    { name: 'Edge', regex: /Edg\/([0-9.]+)/ }
  ];

  for (const browser of browserRegexes) {
    const match = ua.match(browser.regex);
    if (match) {
      return `${browser.name} ${match[1]}`;
    }
  }

  return 'Unknown Browser';
} 
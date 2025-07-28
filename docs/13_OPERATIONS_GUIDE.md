# 🏕️ Camping Finder - 운영 가이드

## 📚 문서 정보
**문서명**: 운영 가이드  
**버전**: v1.0.0  
**작성일**: 2025년 7월 28일  
**최종 업데이트**: 2025년 7월 28일  
**문서 상태**: 완료

## 🎯 운영 목표

### 핵심 목표
- **서비스 가용성**: 99.9% 이상의 서비스 가용성 유지
- **성능 모니터링**: 실시간 성능 지표 추적 및 최적화
- **장애 대응**: 신속한 장애 감지 및 복구
- **보안 관리**: 지속적인 보안 모니터링 및 대응

### 운영 원칙
- **프로액티브 모니터링**: 장애 발생 전 예방적 대응
- **자동화 우선**: 가능한 모든 운영 작업 자동화
- **문서화**: 모든 운영 프로세스 문서화
- **지속적 개선**: 운영 프로세스 지속적 개선

## 📊 모니터링 설정

### 모니터링 아키텍처

#### 1. 모니터링 시스템 구조
```typescript
// 모니터링 시스템 구성
interface MonitoringSystem {
  // 1. 인프라 모니터링
  infrastructure: {
    server: ServerMonitor;
    database: DatabaseMonitor;
    network: NetworkMonitor;
    storage: StorageMonitor;
  };
  
  // 2. 애플리케이션 모니터링
  application: {
    performance: PerformanceMonitor;
    errors: ErrorMonitor;
    business: BusinessMonitor;
    security: SecurityMonitor;
  };
  
  // 3. 사용자 경험 모니터링
  userExperience: {
    realUser: RealUserMonitor;
    synthetic: SyntheticMonitor;
    accessibility: AccessibilityMonitor;
  };
  
  // 4. 알림 시스템
  alerting: {
    channels: AlertChannel[];
    rules: AlertRule[];
    escalation: EscalationPolicy;
  };
}

// 모니터링 설정
const monitoringConfig = {
  // Vercel Analytics 설정
  vercel: {
    analytics: true,
    speedInsights: true,
    webVitals: true
  },
  
  // 커스텀 모니터링
  custom: {
    performance: {
      coreWebVitals: true,
      customMetrics: true,
      errorTracking: true
    },
    business: {
      userActions: true,
      conversionTracking: true,
      featureUsage: true
    }
  }
};
```

#### 2. 성능 모니터링 설정
```typescript
// 성능 모니터링 클래스
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    // Core Web Vitals 모니터링
    this.observeWebVitals();
    
    // 커스텀 성능 메트릭 모니터링
    this.observeCustomMetrics();
    
    // 에러 모니터링
    this.observeErrors();
  }

  private observeWebVitals(): void {
    // LCP (Largest Contentful Paint) 모니터링
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric('LCP', lastEntry.startTime);
      
      // LCP 임계값 체크 (2.5초)
      if (lastEntry.startTime > 2500) {
        this.triggerAlert('LCP_DEGRADED', {
          value: lastEntry.startTime,
          threshold: 2500
        });
      }
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay) 모니터링
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.recordMetric('FID', entry.processingStart - entry.startTime);
        
        // FID 임계값 체크 (100ms)
        if (entry.processingStart - entry.startTime > 100) {
          this.triggerAlert('FID_DEGRADED', {
            value: entry.processingStart - entry.startTime,
            threshold: 100
          });
        }
      });
    });
    
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift) 모니터링
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      
      this.recordMetric('CLS', clsValue);
      
      // CLS 임계값 체크 (0.1)
      if (clsValue > 0.1) {
        this.triggerAlert('CLS_DEGRADED', {
          value: clsValue,
          threshold: 0.1
        });
      }
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  private observeCustomMetrics(): void {
    // API 응답 시간 모니터링
    this.observeApiPerformance();
    
    // 컴포넌트 렌더링 시간 모니터링
    this.observeComponentPerformance();
    
    // 메모리 사용량 모니터링
    this.observeMemoryUsage();
  }

  private observeApiPerformance(): void {
    // fetch API 래핑
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.recordMetric('API_RESPONSE_TIME', duration, {
          url: args[0] as string,
          method: args[1]?.method || 'GET',
          status: response.status
        });
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.recordMetric('API_ERROR', duration, {
          url: args[0] as string,
          method: args[1]?.method || 'GET',
          error: error.message
        });
        
        throw error;
      }
    };
  }

  private observeComponentPerformance(): void {
    // React 컴포넌트 렌더링 시간 측정
    const originalRender = React.Component.prototype.render;
    React.Component.prototype.render = function() {
      const startTime = performance.now();
      const result = originalRender.call(this);
      const endTime = performance.now();
      
      this.recordMetric('COMPONENT_RENDER_TIME', endTime - startTime, {
        component: this.constructor.name
      });
      
      return result;
    };
  }

  private observeMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('MEMORY_USAGE', memory.usedJSHeapSize, {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 30000); // 30초마다 체크
    }
  }

  private recordMetric(name: string, value: number, metadata?: any): void {
    const metric: PerformanceMetrics = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };
    
    this.metrics.push(metric);
    
    // 메트릭 전송
    this.sendMetric(metric);
  }

  private sendMetric(metric: PerformanceMetrics): void {
    // Vercel Analytics로 전송
    if (window.va) {
      window.va.track('performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        ...metric.metadata
      });
    }
    
    // 커스텀 엔드포인트로 전송
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    }).catch(console.error);
  }

  private triggerAlert(type: string, data: any): void {
    const alert: Alert = {
      type,
      data,
      timestamp: Date.now(),
      severity: this.calculateSeverity(type, data)
    };
    
    this.sendAlert(alert);
  }

  private calculateSeverity(type: string, data: any): 'low' | 'medium' | 'high' | 'critical' {
    // 알림 심각도 계산 로직
    const thresholds = {
      LCP_DEGRADED: { medium: 4000, high: 6000 },
      FID_DEGRADED: { medium: 300, high: 500 },
      CLS_DEGRADED: { medium: 0.25, high: 0.5 }
    };
    
    const threshold = thresholds[type];
    if (!threshold) return 'medium';
    
    if (data.value >= threshold.high) return 'high';
    if (data.value >= threshold.medium) return 'medium';
    return 'low';
  }
}
```

#### 3. 에러 모니터링 설정
```typescript
// 에러 모니터링 클래스
class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private errorCounts: Map<string, number> = new Map();

  constructor() {
    this.initializeErrorHandling();
  }

  private initializeErrorHandling(): void {
    // 전역 에러 핸들러
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Promise 에러 핸들러
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'promise',
        promise: event.promise
      });
    });

    // React 에러 바운더리
    this.setupReactErrorBoundary();
  }

  private handleError(error: Error, context: ErrorContext): void {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      type: context.type,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    };

    this.errors.push(errorLog);
    
    // 에러 카운트 증가
    const errorKey = `${error.message}:${context.type}`;
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);
    
    // 에러 전송
    this.sendError(errorLog);
    
    // 임계값 체크
    this.checkErrorThreshold(errorKey);
  }

  private setupReactErrorBoundary(): void {
    // React 에러 바운더리 컴포넌트
    class ErrorBoundary extends React.Component {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.handleError(error, {
          type: 'react',
          componentStack: errorInfo.componentStack
        });
      }

      render() {
        if (this.state.hasError) {
          return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
      }
    }
  }

  private checkErrorThreshold(errorKey: string): void {
    const count = this.errorCounts.get(errorKey) || 0;
    const threshold = 10; // 10회 이상 발생 시 알림
    
    if (count >= threshold) {
      this.triggerAlert('ERROR_THRESHOLD_EXCEEDED', {
        errorKey,
        count,
        threshold
      });
    }
  }

  private sendError(errorLog: ErrorLog): void {
    // Vercel Analytics로 전송
    if (window.va) {
      window.va.track('error', {
        message: errorLog.message,
        type: errorLog.type,
        url: errorLog.url
      });
    }
    
    // 커스텀 엔드포인트로 전송
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog)
    }).catch(console.error);
  }
}
```

## 📝 로그 관리

### 로그 시스템 아키텍처

#### 1. 로그 구조 및 포맷
```typescript
// 로그 레벨 정의
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

// 로그 엔트리 인터페이스
interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context: {
    service: string;
    version: string;
    environment: string;
    userId?: string;
    sessionId?: string;
    requestId?: string;
  };
  metadata?: Record<string, any>;
  stack?: string;
}

// 로그 매니저 클래스
class LogManager {
  private logs: LogEntry[] = [];
  private config: LogConfig;

  constructor(config: LogConfig) {
    this.config = config;
    this.initializeLogging();
  }

  private initializeLogging(): void {
    // 콘솔 로깅 설정
    if (this.config.console.enabled) {
      this.setupConsoleLogging();
    }
    
    // 원격 로깅 설정
    if (this.config.remote.enabled) {
      this.setupRemoteLogging();
    }
    
    // 로그 로테이션 설정
    if (this.config.rotation.enabled) {
      this.setupLogRotation();
    }
  }

  private setupConsoleLogging(): void {
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };

    // 콘솔 메서드 오버라이드
    console.log = (...args) => this.log(LogLevel.INFO, args.join(' '));
    console.info = (...args) => this.log(LogLevel.INFO, args.join(' '));
    console.warn = (...args) => this.log(LogLevel.WARN, args.join(' '));
    console.error = (...args) => this.log(LogLevel.ERROR, args.join(' '));
    console.debug = (...args) => this.log(LogLevel.DEBUG, args.join(' '));
  }

  private setupRemoteLogging(): void {
    // 로그 배치 전송
    setInterval(() => {
      this.sendLogBatch();
    }, this.config.remote.batchInterval);
  }

  private setupLogRotation(): void {
    // 로그 파일 크기 제한
    const maxSize = this.config.rotation.maxSize;
    const maxFiles = this.config.rotation.maxFiles;
    
    // 로그 로테이션 로직
    this.rotateLogsIfNeeded(maxSize, maxFiles);
  }

  log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context: {
        service: 'camping-finder',
        version: process.env.VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        userId: this.getCurrentUserId(),
        sessionId: this.getSessionId(),
        requestId: this.getRequestId()
      },
      metadata
    };

    // 로그 레벨 필터링
    if (level >= this.config.minLevel) {
      this.logs.push(logEntry);
      
      // 즉시 전송이 필요한 로그
      if (level >= LogLevel.ERROR) {
        this.sendLogImmediately(logEntry);
      }
    }
  }

  private sendLogBatch(): void {
    if (this.logs.length === 0) return;

    const batch = this.logs.splice(0, this.config.remote.batchSize);
    
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch)
    }).catch(error => {
      console.error('Failed to send logs:', error);
      // 실패한 로그를 다시 큐에 추가
      this.logs.unshift(...batch);
    });
  }

  private sendLogImmediately(logEntry: LogEntry): void {
    fetch('/api/logs/urgent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(console.error);
  }

  // 유틸리티 메서드들
  private getCurrentUserId(): string | undefined {
    // 현재 사용자 ID 반환 로직
    return localStorage.getItem('userId') || undefined;
  }

  private getSessionId(): string {
    // 세션 ID 생성 또는 반환
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  private getRequestId(): string {
    // 요청 ID 생성
    return this.generateRequestId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

#### 2. 로그 분석 및 검색
```typescript
// 로그 분석기 클래스
class LogAnalyzer {
  private logs: LogEntry[] = [];

  constructor(logs: LogEntry[]) {
    this.logs = logs;
  }

  // 에러 패턴 분석
  analyzeErrorPatterns(): ErrorPattern[] {
    const errorLogs = this.logs.filter(log => log.level >= LogLevel.ERROR);
    const patterns: Map<string, ErrorPattern> = new Map();

    errorLogs.forEach(log => {
      const key = this.getErrorKey(log);
      const pattern = patterns.get(key) || {
        message: log.message,
        count: 0,
        firstOccurrence: log.timestamp,
        lastOccurrence: log.timestamp,
        contexts: new Set<string>()
      };

      pattern.count++;
      pattern.lastOccurrence = log.timestamp;
      pattern.contexts.add(log.context.environment);

      patterns.set(key, pattern);
    });

    return Array.from(patterns.values())
      .sort((a, b) => b.count - a.count);
  }

  // 성능 패턴 분석
  analyzePerformancePatterns(): PerformancePattern[] {
    const performanceLogs = this.logs.filter(log => 
      log.metadata?.type === 'performance'
    );

    const patterns: Map<string, PerformancePattern> = new Map();

    performanceLogs.forEach(log => {
      const metric = log.metadata?.metric;
      if (!metric) return;

      const pattern = patterns.get(metric) || {
        metric,
        count: 0,
        totalValue: 0,
        minValue: Infinity,
        maxValue: -Infinity,
        averageValue: 0
      };

      const value = log.metadata?.value || 0;
      pattern.count++;
      pattern.totalValue += value;
      pattern.minValue = Math.min(pattern.minValue, value);
      pattern.maxValue = Math.max(pattern.maxValue, value);
      pattern.averageValue = pattern.totalValue / pattern.count;

      patterns.set(metric, pattern);
    });

    return Array.from(patterns.values());
  }

  // 사용자 행동 패턴 분석
  analyzeUserBehaviorPatterns(): UserBehaviorPattern[] {
    const userLogs = this.logs.filter(log => 
      log.metadata?.type === 'user_action'
    );

    const patterns: Map<string, UserBehaviorPattern> = new Map();

    userLogs.forEach(log => {
      const action = log.metadata?.action;
      if (!action) return;

      const pattern = patterns.get(action) || {
        action,
        count: 0,
        uniqueUsers: new Set<string>(),
        averageSessionDuration: 0,
        conversionRate: 0
      };

      pattern.count++;
      if (log.context.userId) {
        pattern.uniqueUsers.add(log.context.userId);
      }

      patterns.set(action, pattern);
    });

    return Array.from(patterns.values())
      .map(pattern => ({
        ...pattern,
        uniqueUsers: pattern.uniqueUsers.size
      }));
  }

  private getErrorKey(log: LogEntry): string {
    // 에러 메시지와 스택의 첫 번째 라인으로 키 생성
    const stackFirstLine = log.stack?.split('\n')[1] || '';
    return `${log.message}:${stackFirstLine}`;
  }
}
```

## 💾 백업 전략

### 백업 시스템 아키텍처

#### 1. 백업 정책 및 스케줄
```typescript
// 백업 정책 정의
interface BackupPolicy {
  // 백업 유형
  types: {
    full: FullBackupConfig;
    incremental: IncrementalBackupConfig;
    differential: DifferentialBackupConfig;
  };
  
  // 백업 스케줄
  schedule: {
    daily: BackupSchedule;
    weekly: BackupSchedule;
    monthly: BackupSchedule;
  };
  
  // 보관 정책
  retention: {
    daily: number;    // 일일 백업 보관 기간
    weekly: number;   // 주간 백업 보관 기간
    monthly: number;  // 월간 백업 보관 기간
  };
  
  // 암호화 설정
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyRotation: boolean;
  };
}

// 백업 매니저 클래스
class BackupManager {
  private policy: BackupPolicy;
  private backups: Backup[] = [];

  constructor(policy: BackupPolicy) {
    this.policy = policy;
    this.initializeBackupSchedule();
  }

  private initializeBackupSchedule(): void {
    // 일일 백업 스케줄
    this.scheduleBackup('daily', this.policy.schedule.daily);
    
    // 주간 백업 스케줄
    this.scheduleBackup('weekly', this.policy.schedule.weekly);
    
    // 월간 백업 스케줄
    this.scheduleBackup('monthly', this.policy.schedule.monthly);
  }

  private scheduleBackup(type: string, schedule: BackupSchedule): void {
    const cronExpression = this.convertScheduleToCron(schedule);
    
    // Cron 작업 스케줄링
    this.scheduleCronJob(cronExpression, () => {
      this.performBackup(type);
    });
  }

  async performBackup(type: string): Promise<Backup> {
    const backup: Backup = {
      id: this.generateBackupId(),
      type,
      timestamp: new Date(),
      status: 'in_progress',
      size: 0,
      checksum: '',
      location: ''
    };

    try {
      // 백업 수행
      const result = await this.executeBackup(type);
      
      backup.status = 'completed';
      backup.size = result.size;
      backup.checksum = result.checksum;
      backup.location = result.location;
      
      // 백업 검증
      await this.validateBackup(backup);
      
      // 백업 목록에 추가
      this.backups.push(backup);
      
      // 오래된 백업 정리
      await this.cleanupOldBackups();
      
      return backup;
    } catch (error) {
      backup.status = 'failed';
      backup.error = error.message;
      
      // 실패 알림
      this.notifyBackupFailure(backup, error);
      
      throw error;
    }
  }

  private async executeBackup(type: string): Promise<BackupResult> {
    switch (type) {
      case 'full':
        return this.performFullBackup();
      case 'incremental':
        return this.performIncrementalBackup();
      case 'differential':
        return this.performDifferentialBackup();
      default:
        throw new Error(`Unknown backup type: ${type}`);
    }
  }

  private async performFullBackup(): Promise<BackupResult> {
    // 전체 백업 수행
    const data = await this.collectAllData();
    const compressed = await this.compressData(data);
    const encrypted = await this.encryptData(compressed);
    const location = await this.uploadToStorage(encrypted);
    const checksum = await this.calculateChecksum(encrypted);
    
    return {
      size: encrypted.length,
      checksum,
      location
    };
  }

  private async performIncrementalBackup(): Promise<BackupResult> {
    // 증분 백업 수행
    const lastBackup = this.getLastBackup();
    const changes = await this.getChangesSince(lastBackup.timestamp);
    const compressed = await this.compressData(changes);
    const encrypted = await this.encryptData(compressed);
    const location = await this.uploadToStorage(encrypted);
    const checksum = await this.calculateChecksum(encrypted);
    
    return {
      size: encrypted.length,
      checksum,
      location
    };
  }

  private async validateBackup(backup: Backup): Promise<boolean> {
    // 백업 무결성 검증
    const downloaded = await this.downloadFromStorage(backup.location);
    const decrypted = await this.decryptData(downloaded);
    const calculatedChecksum = await this.calculateChecksum(downloaded);
    
    if (calculatedChecksum !== backup.checksum) {
      throw new Error('Backup checksum validation failed');
    }
    
    return true;
  }

  private async cleanupOldBackups(): Promise<void> {
    const now = new Date();
    
    // 보관 기간이 지난 백업 삭제
    this.backups = this.backups.filter(backup => {
      const age = now.getTime() - backup.timestamp.getTime();
      const retentionDays = this.getRetentionDays(backup.type);
      
      return age < retentionDays * 24 * 60 * 60 * 1000;
    });
  }

  private getRetentionDays(type: string): number {
    switch (type) {
      case 'daily':
        return this.policy.retention.daily;
      case 'weekly':
        return this.policy.retention.weekly;
      case 'monthly':
        return this.policy.retention.monthly;
      default:
        return 30; // 기본 30일
    }
  }
}
```

#### 2. 복구 프로세스
```typescript
// 복구 매니저 클래스
class RecoveryManager {
  private backups: Backup[] = [];

  constructor(backups: Backup[]) {
    this.backups = backups;
  }

  async performRecovery(backupId: string, targetEnvironment: string): Promise<RecoveryResult> {
    const backup = this.backups.find(b => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`);
    }

    const recovery: RecoveryResult = {
      id: this.generateRecoveryId(),
      backupId,
      targetEnvironment,
      timestamp: new Date(),
      status: 'in_progress',
      steps: []
    };

    try {
      // 1. 백업 다운로드
      recovery.steps.push('Downloading backup...');
      const backupData = await this.downloadBackup(backup);
      
      // 2. 데이터 복호화
      recovery.steps.push('Decrypting data...');
      const decryptedData = await this.decryptData(backupData);
      
      // 3. 데이터 압축 해제
      recovery.steps.push('Decompressing data...');
      const decompressedData = await this.decompressData(decryptedData);
      
      // 4. 환경별 데이터 변환
      recovery.steps.push('Transforming data for target environment...');
      const transformedData = await this.transformData(decompressedData, targetEnvironment);
      
      // 5. 데이터 복원
      recovery.steps.push('Restoring data...');
      await this.restoreData(transformedData, targetEnvironment);
      
      // 6. 복원 검증
      recovery.steps.push('Validating recovery...');
      await this.validateRecovery(transformedData, targetEnvironment);
      
      recovery.status = 'completed';
      recovery.completedAt = new Date();
      
      return recovery;
    } catch (error) {
      recovery.status = 'failed';
      recovery.error = error.message;
      recovery.failedAt = new Date();
      
      // 실패 알림
      this.notifyRecoveryFailure(recovery, error);
      
      throw error;
    }
  }

  async performPointInTimeRecovery(targetTime: Date): Promise<RecoveryResult> {
    // 특정 시점 복구
    const backup = this.findBackupAtTime(targetTime);
    if (!backup) {
      throw new Error(`No backup available at ${targetTime}`);
    }

    return this.performRecovery(backup.id, 'production');
  }

  private findBackupAtTime(targetTime: Date): Backup | null {
    // 타겟 시간에 가장 가까운 백업 찾기
    return this.backups
      .filter(backup => backup.timestamp <= targetTime)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0] || null;
  }

  private async validateRecovery(data: any, environment: string): Promise<boolean> {
    // 복원된 데이터 검증
    const validationChecks = [
      this.validateDataIntegrity(data),
      this.validateDataConsistency(data),
      this.validateApplicationStartup(environment)
    ];

    const results = await Promise.all(validationChecks);
    return results.every(result => result === true);
  }
}
```

## 🚨 장애 대응

### 장애 대응 프로세스

#### 1. 장애 감지 및 분류
```typescript
// 장애 분류 시스템
enum IncidentSeverity {
  LOW = 'low',           // 서비스 영향 없음
  MEDIUM = 'medium',     // 일부 기능 제한
  HIGH = 'high',         // 주요 기능 장애
  CRITICAL = 'critical'  // 전체 서비스 장애
}

enum IncidentStatus {
  DETECTED = 'detected',
  INVESTIGATING = 'investigating',
  MITIGATED = 'mitigated',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

// 장애 인시던트 인터페이스
interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectedAt: Date;
  resolvedAt?: Date;
  assignee?: string;
  category: string;
  impact: {
    users: number;
    services: string[];
    revenue?: number;
  };
  timeline: IncidentTimeline[];
  rootCause?: string;
  resolution?: string;
  lessons?: string[];
}

// 장애 대응 매니저
class IncidentResponseManager {
  private incidents: Incident[] = [];
  private escalationPolicy: EscalationPolicy;

  constructor(escalationPolicy: EscalationPolicy) {
    this.escalationPolicy = escalationPolicy;
    this.initializeIncidentDetection();
  }

  private initializeIncidentDetection(): void {
    // 자동 장애 감지 설정
    this.setupAutomatedDetection();
    
    // 수동 장애 보고 설정
    this.setupManualReporting();
    
    // 알림 시스템 설정
    this.setupNotificationSystem();
  }

  private setupAutomatedDetection(): void {
    // 성능 임계값 모니터링
    this.monitorPerformanceThresholds();
    
    // 에러율 모니터링
    this.monitorErrorRates();
    
    // 가용성 모니터링
    this.monitorAvailability();
  }

  private monitorPerformanceThresholds(): void {
    // Core Web Vitals 임계값 모니터링
    const thresholds = {
      LCP: 2500,  // 2.5초
      FID: 100,   // 100ms
      CLS: 0.1    // 0.1
    };

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      this.setupThresholdAlert(metric, threshold);
    });
  }

  private setupThresholdAlert(metric: string, threshold: number): void {
    // 임계값 초과 시 장애 생성
    const alertHandler = (value: number) => {
      if (value > threshold) {
        this.createIncident({
          title: `${metric} 성능 저하`,
          description: `${metric} 값이 ${value}로 임계값 ${threshold}를 초과했습니다.`,
          severity: this.calculateSeverity(value, threshold),
          category: 'performance'
        });
      }
    };

    // 메트릭 모니터링에 콜백 등록
    this.registerMetricCallback(metric, alertHandler);
  }

  private monitorErrorRates(): void {
    // 에러율 임계값 설정
    const errorRateThreshold = 0.05; // 5%
    
    setInterval(() => {
      const errorRate = this.calculateErrorRate();
      
      if (errorRate > errorRateThreshold) {
        this.createIncident({
          title: '높은 에러율 감지',
          description: `현재 에러율이 ${(errorRate * 100).toFixed(2)}%로 임계값 ${(errorRateThreshold * 100).toFixed(2)}%를 초과했습니다.`,
          severity: this.calculateErrorSeverity(errorRate),
          category: 'errors'
        });
      }
    }, 60000); // 1분마다 체크
  }

  private monitorAvailability(): void {
    // 서비스 가용성 모니터링
    const healthCheckInterval = 30000; // 30초
    
    setInterval(async () => {
      const healthStatus = await this.performHealthCheck();
      
      if (!healthStatus.healthy) {
        this.createIncident({
          title: '서비스 가용성 문제',
          description: `서비스가 응답하지 않습니다. 상태: ${healthStatus.status}`,
          severity: IncidentSeverity.HIGH,
          category: 'availability'
        });
      }
    }, healthCheckInterval);
  }

  createIncident(data: Partial<Incident>): Incident {
    const incident: Incident = {
      id: this.generateIncidentId(),
      title: data.title!,
      description: data.description!,
      severity: data.severity!,
      status: IncidentStatus.DETECTED,
      detectedAt: new Date(),
      category: data.category!,
      impact: data.impact || { users: 0, services: [] },
      timeline: [{
        timestamp: new Date(),
        action: 'incident_detected',
        description: '장애가 감지되었습니다.'
      }]
    };

    this.incidents.push(incident);
    
    // 장애 알림 발송
    this.notifyIncident(incident);
    
    // 에스컬레이션 체크
    this.checkEscalation(incident);
    
    return incident;
  }

  private calculateSeverity(value: number, threshold: number): IncidentSeverity {
    const ratio = value / threshold;
    
    if (ratio >= 3) return IncidentSeverity.CRITICAL;
    if (ratio >= 2) return IncidentSeverity.HIGH;
    if (ratio >= 1.5) return IncidentSeverity.MEDIUM;
    return IncidentSeverity.LOW;
  }

  private calculateErrorSeverity(errorRate: number): IncidentSeverity {
    if (errorRate > 0.2) return IncidentSeverity.CRITICAL;
    if (errorRate > 0.1) return IncidentSeverity.HIGH;
    if (errorRate > 0.05) return IncidentSeverity.MEDIUM;
    return IncidentSeverity.LOW;
  }

  private async performHealthCheck(): Promise<HealthStatus> {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          healthy: true,
          status: 'ok',
          details: data
        };
      } else {
        return {
          healthy: false,
          status: `http_${response.status}`,
          details: null
        };
      }
    } catch (error) {
      return {
        healthy: false,
        status: 'timeout',
        details: error.message
      };
    }
  }
}
```

#### 2. 장애 대응 워크플로우
```typescript
// 장애 대응 워크플로우
interface IncidentWorkflow {
  // 1. 장애 감지
  detection: {
    automated: boolean;
    manual: boolean;
    sources: string[];
  };
  
  // 2. 초기 대응
  initialResponse: {
    timeLimit: number; // 분 단위
    actions: string[];
    notifications: string[];
  };
  
  // 3. 조사 및 분석
  investigation: {
    timeLimit: number;
    tools: string[];
    documentation: string[];
  };
  
  // 4. 완화 조치
  mitigation: {
    timeLimit: number;
    strategies: string[];
    rollback: string;
  };
  
  // 5. 해결 및 복구
  resolution: {
    timeLimit: number;
    verification: string[];
    communication: string[];
  };
  
  // 6. 사후 분석
  postMortem: {
    timeLimit: number;
    participants: string[];
    deliverables: string[];
  };
}

// 장애 대응 실행기
class IncidentWorkflowExecutor {
  private workflow: IncidentWorkflow;
  private incident: Incident;

  constructor(workflow: IncidentWorkflow, incident: Incident) {
    this.workflow = workflow;
    this.incident = incident;
  }

  async executeWorkflow(): Promise<WorkflowResult> {
    const result: WorkflowResult = {
      incidentId: this.incident.id,
      steps: [],
      startTime: new Date(),
      endTime: undefined,
      status: 'in_progress'
    };

    try {
      // 1. 초기 대응
      result.steps.push(await this.executeInitialResponse());
      
      // 2. 조사 및 분석
      result.steps.push(await this.executeInvestigation());
      
      // 3. 완화 조치
      result.steps.push(await this.executeMitigation());
      
      // 4. 해결 및 복구
      result.steps.push(await this.executeResolution());
      
      // 5. 사후 분석
      result.steps.push(await this.executePostMortem());
      
      result.status = 'completed';
      result.endTime = new Date();
      
      return result;
    } catch (error) {
      result.status = 'failed';
      result.error = error.message;
      result.endTime = new Date();
      
      throw error;
    }
  }

  private async executeInitialResponse(): Promise<WorkflowStep> {
    const step: WorkflowStep = {
      name: 'initial_response',
      startTime: new Date(),
      actions: []
    };

    // 즉시 알림 발송
    step.actions.push(await this.sendImmediateNotifications());
    
    // 담당자 할당
    step.actions.push(await this.assignIncidentOwner());
    
    // 초기 상태 업데이트
    step.actions.push(await this.updateIncidentStatus(IncidentStatus.INVESTIGATING));
    
    step.endTime = new Date();
    return step;
  }

  private async executeInvestigation(): Promise<WorkflowStep> {
    const step: WorkflowStep = {
      name: 'investigation',
      startTime: new Date(),
      actions: []
    };

    // 로그 수집
    step.actions.push(await this.collectLogs());
    
    // 메트릭 분석
    step.actions.push(await this.analyzeMetrics());
    
    // 근본 원인 분석
    step.actions.push(await this.analyzeRootCause());
    
    step.endTime = new Date();
    return step;
  }

  private async executeMitigation(): Promise<WorkflowStep> {
    const step: WorkflowStep = {
      name: 'mitigation',
      startTime: new Date(),
      actions: []
    };

    // 임시 해결책 적용
    step.actions.push(await this.applyTemporaryFix());
    
    // 서비스 상태 확인
    step.actions.push(await this.verifyServiceHealth());
    
    // 사용자 통지
    step.actions.push(await this.notifyUsers());
    
    step.endTime = new Date();
    return step;
  }

  private async executeResolution(): Promise<WorkflowStep> {
    const step: WorkflowStep = {
      name: 'resolution',
      startTime: new Date(),
      actions: []
    };

    // 영구 해결책 적용
    step.actions.push(await this.applyPermanentFix());
    
    // 해결 검증
    step.actions.push(await this.verifyResolution());
    
    // 장애 상태 업데이트
    step.actions.push(await this.updateIncidentStatus(IncidentStatus.RESOLVED));
    
    step.endTime = new Date();
    return step;
  }

  private async executePostMortem(): Promise<WorkflowStep> {
    const step: WorkflowStep = {
      name: 'post_mortem',
      startTime: new Date(),
      actions: []
    };

    // 사후 분석 회의
    step.actions.push(await this.conductPostMortem());
    
    // 개선 사항 도출
    step.actions.push(await this.identifyImprovements());
    
    // 문서화
    step.actions.push(await this.documentLessonsLearned());
    
    step.endTime = new Date();
    return step;
  }
}
```

## 📋 운영 체크리스트

### 일일 운영 체크리스트
- [ ] 서비스 가용성 확인 (99.9% 이상)
- [ ] 성능 메트릭 검토 (Core Web Vitals)
- [ ] 에러 로그 분석
- [ ] 백업 상태 확인
- [ ] 보안 알림 검토

### 주간 운영 체크리스트
- [ ] 성능 트렌드 분석
- [ ] 용량 계획 검토
- [ ] 보안 취약점 스캔
- [ ] 백업 복구 테스트
- [ ] 운영 문서 업데이트

### 월간 운영 체크리스트
- [ ] 전체 시스템 상태 검토
- [ ] 운영 프로세스 개선
- [ ] 팀 교육 및 훈련
- [ ] 재해 복구 계획 검토
- [ ] 비용 최적화 검토

---

**이 운영 가이드를 통해 Camping Finder 프로젝트의 안정적이고 효율적인 운영을 보장할 수 있습니다.** 
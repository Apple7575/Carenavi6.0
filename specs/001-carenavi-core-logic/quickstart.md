# Quickstart: CareNavi Core Logic

**Date**: 2025-12-16
**Feature**: 001-carenavi-core-logic

## Prerequisites

- Node.js 18+
- Yarn 또는 npm
- Xcode 15+ (iOS 개발)
- Android Studio (Android 개발)
- CocoaPods (iOS 의존성)
- Supabase 계정 및 프로젝트
- Google AI Studio 계정 (Gemini API)

## 1. Project Setup

### 1.1 Create React Native Project

```bash
npx @react-native-community/cli init CareNavi --template react-native-template-typescript
cd CareNavi
```

### 1.2 Install Dependencies

```bash
# Navigation
yarn add @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
yarn add react-native-screens react-native-safe-area-context

# State Management
yarn add zustand

# Animation
yarn add lottie-react-native react-native-reanimated

# Supabase
yarn add @supabase/supabase-js
yarn add @react-native-async-storage/async-storage

# AI
yarn add @google/generative-ai

# Utilities
yarn add zod date-fns

# Dev Dependencies
yarn add -D @types/react @testing-library/react-native jest detox
```

### 1.3 iOS Setup

```bash
cd ios
pod install
cd ..
```

**ios/Podfile 수정** (Reanimated 지원):
```ruby
# 상단에 추가
require_relative '../node_modules/react-native-reanimated/scripts/reanimated_setup'

# use_react_native! 아래에 추가
:app_path => "#{Pod::Config.instance.installation_root}/.."
```

### 1.4 Configure Reanimated

**babel.config.js**:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

## 2. Environment Setup

### 2.1 Create Config Files

**src/config/env.ts**:
```typescript
export const ENV = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',
};
```

**.gitignore에 추가**:
```
src/config/env.ts
```

**src/config/env.example.ts** (커밋용 템플릿):
```typescript
export const ENV = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  GEMINI_API_KEY: 'your-gemini-api-key',
};
```

## 3. Supabase Setup

### 3.1 Create Tables

Supabase Dashboard > SQL Editor에서 실행:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(50) DEFAULT '헬띠',
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  stage VARCHAR(20) DEFAULT 'egg',
  appearance_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily States
CREATE TABLE public.daily_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  state VARCHAR(20) NOT NULL DEFAULT 'before_check',
  reset_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Condition Records
CREATE TABLE public.condition_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  raw_input TEXT NOT NULL,
  mood VARCHAR(50),
  physical VARCHAR(100),
  main_issue VARCHAR(100),
  ai_analysis JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Missions
CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  condition_record_id UUID REFERENCES public.condition_records(id),
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  estimated_duration VARCHAR(20),
  xp_reward INTEGER NOT NULL CHECK (xp_reward > 0),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  condition_keywords TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Recommendations
CREATE TABLE public.product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  condition_record_id UUID NOT NULL REFERENCES public.condition_records(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  match_reason TEXT,
  is_clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_daily_states_user_date ON daily_states(user_id, date DESC);
CREATE INDEX idx_condition_records_user_date ON condition_records(user_id, date DESC);
CREATE INDEX idx_missions_user_date ON missions(user_id, date DESC);
CREATE INDEX idx_products_category ON products(category) WHERE is_active = TRUE;
```

### 3.2 Enable RLS

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY users_self ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY characters_owner ON characters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY daily_states_owner ON daily_states FOR ALL USING (auth.uid() = user_id);
CREATE POLICY condition_records_owner ON condition_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY missions_owner ON missions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY products_public ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY recommendations_owner ON product_recommendations FOR ALL USING (auth.uid() = user_id);
```

### 3.3 Create Helper Functions

```sql
-- Level calculation function
CREATE OR REPLACE FUNCTION calculate_level(p_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_level INTEGER := 1;
  v_xp_needed INTEGER := 100;
  v_remaining INTEGER := p_xp;
BEGIN
  WHILE v_remaining >= v_xp_needed LOOP
    v_remaining := v_remaining - v_xp_needed;
    v_level := v_level + 1;
    v_xp_needed := 100 + (v_level - 1) * 50;
  END LOOP;
  RETURN v_level;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Stage calculation function
CREATE OR REPLACE FUNCTION calculate_stage(p_level INTEGER)
RETURNS VARCHAR(20) AS $$
BEGIN
  IF p_level < 5 THEN RETURN 'egg';
  ELSIF p_level < 15 THEN RETURN 'baby';
  ELSIF p_level < 30 THEN RETURN 'child';
  ELSIF p_level < 50 THEN RETURN 'teen';
  ELSE RETURN 'adult';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

## 4. Run the App

### 4.1 Start Metro

```bash
yarn start
```

### 4.2 Run on iOS

```bash
yarn ios
```

### 4.3 Run on Android

```bash
yarn android
```

## 5. Verify Setup

### 5.1 Check Supabase Connection

**src/services/supabase.ts**:
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Test connection
export async function testConnection() {
  const { data, error } = await supabase.from('products').select('count');
  console.log('Supabase connection:', error ? 'FAILED' : 'OK');
  return !error;
}
```

### 5.2 Check Gemini Connection

**src/services/geminiService.ts**:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env';

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const result = await model.generateContent('Say hello in Korean');
    console.log('Gemini connection: OK');
    console.log('Response:', result.response.text());
    return true;
  } catch (error) {
    console.log('Gemini connection: FAILED', error);
    return false;
  }
}
```

## 6. Sample Data

### 6.1 Insert Test Products

```sql
INSERT INTO products (name, description, category, price, condition_keywords) VALUES
('비타민 B 컴플렉스', '피로 회복에 도움이 되는 비타민', 'supplements', 25000, ARRAY['피로', '에너지', '무기력']),
('마그네슘 400', '근육 이완과 수면 개선', 'supplements', 18000, ARRAY['근육', '통증', '수면', '스트레스']),
('오메가3 1000mg', '뇌 건강과 집중력 향상', 'supplements', 35000, ARRAY['집중', '두통', '브레인포그']),
('힐링 아로마 디퓨저', '스트레스 해소 아로마테라피', 'wellness', 45000, ARRAY['스트레스', '불안', '휴식']),
('허브티 세트', '마음을 편안하게 하는 허브차', 'food', 28000, ARRAY['스트레스', '수면', '휴식']);
```

## 7. Troubleshooting

### iOS Build Issues

```bash
# Clean build
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reset Metro cache
yarn start --reset-cache
```

### Android Build Issues

```bash
# Clean build
cd android && ./gradlew clean && cd ..

# If Gradle version issues
rm -rf ~/.gradle/caches
```

### Reanimated Issues

1. Metro 캐시 삭제: `yarn start --reset-cache`
2. iOS: pod 재설치
3. Android: clean build

## Next Steps

1. `/speckit.tasks` 실행하여 구현 태스크 생성
2. 태스크 순서대로 TDD 방식으로 구현
3. 각 User Story 완료 후 테스트 실행

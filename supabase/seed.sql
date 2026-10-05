-- supabase/seed.sql
insert into public.plan (name, description, stripe_price_id, max_scripts, is_active, sort_order, is_recommended, features)
values
  ('フリー', '気軽に始めたい方向けの無料プラン', null, 1, true, 0, false, '[
  {
    "text": "台本作成：1件まで",
    "enabled": true
  },
  {
    "text": "台本自動スクロールの速度調整",
    "enabled": true
  },
  {
    "text": "広告非表示",
    "enabled": false
  },
  {
    "text": "鏡文字機能",
    "enabled": false
  },
  {
    "text": "カウントダウン機能",
    "enabled": false
  }
]'),
  ('スタンダード', '日常的に使いたい方に最適なバランスプラン', 'price_1QpmrVClMx9BUZ3JExMMOzIk', 50, true, 10, true, '[
  {
    "text": "台本作成：50件まで",
    "enabled": true
  },
  {
    "text": "台本自動スクロールの速度調整",
    "enabled": true
  },
  {
    "text": "広告非表示",
    "enabled": false
  },
  {
    "text": "鏡文字機能",
    "enabled": false
  },
  {
    "text": "カウントダウン機能",
    "enabled": false
  }
]'),
  ('プレミアム', 'ビジネス利用や本格運用に', 'price_1Qpms9ClMx9BUZ3JQxVAlPkW', null, true, 100, false, '[
  {
    "text": "台本作成：無制限",
    "enabled": true
  },
  {
    "text": "台本自動スクロールの速度調整",
    "enabled": true
  },
  {
    "text": "広告非表示",
    "enabled": false
  },
  {
    "text": "鏡文字機能",
    "enabled": false
  },
  {
    "text": "カウントダウン機能",
    "enabled": false
  }
]');

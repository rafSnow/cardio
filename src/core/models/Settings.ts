export type SettingKey =
  | 'weekly_goal_sessions'   // number — padrão: 3
  | 'dark_mode'              // boolean — padrão: false
  | 'notifications_enabled'  // boolean — padrão: false
  | 'notification_time'      // string HH:MM — padrão: '19:00'
  | 'inactivity_days'        // number — padrão: 3
  | 'notify_register'        // boolean
  | 'notify_inactivity'      // boolean
  | 'notify_goal'            // boolean
  | 'notify_pr'              // boolean;

export interface Setting {
  key: SettingKey;
  value: any;                // Serializado como JSON
}

import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const customTheme: CustomThemeConfig = {
  name: "customTheme",
  properties: {
    // =~= Theme Properties =~=
    "--theme-font-family-base": `system-ui`,
    "--theme-font-family-heading": `system-ui`,
    "--theme-font-color-base": "0 0 0",
    "--theme-font-color-dark": "255 255 255",
    "--theme-rounded-base": "9999px",
    "--theme-rounded-container": "8px",
    "--theme-border-base": "1px",
    // =~= Theme On-X Colors =~=
    "--on-primary": "0 0 0",
    "--on-secondary": "255 255 255",
    "--on-tertiary": "0 0 0",
    "--on-success": "0 0 0",
    "--on-warning": "0 0 0",
    "--on-error": "255 255 255",
    "--on-surface": "255 255 255",
    // =~= Theme Colors  =~=
    // primary | #ff3c00
    "--color-primary-50": "255 227 219", // #ffe3db
    "--color-primary-100": "255 204 189", // #ffccbd
    "--color-primary-200": "255 178 153", // #ffb299
    "--color-primary-300": "255 133 102", // #ff8566
    "--color-primary-400": "255 85 51", // #ff5533
    "--color-primary-500": "255 60 0", // #ff3c00
    "--color-primary-600": "230 54 0", // #e63600
    "--color-primary-700": "204 46 0", // #cc2e00
    "--color-primary-800": "179 40 0", // #b32800
    "--color-primary-900": "153 34 0", // #992200
    // secondary | #06B6D4
    "--color-secondary-50": "236 254 255", // #ecfeff
    "--color-secondary-100": "207 250 254", // #cffafd
    "--color-secondary-200": "165 243 252", // #a5f3fc
    "--color-secondary-300": "103 232 249", // #67e8f9
    "--color-secondary-400": "34 211 238", // #22d3ee
    "--color-secondary-500": "6 182 212", // #06B6D4
    "--color-secondary-600": "5 150 180", // #0596b4
    "--color-secondary-700": "7 115 132", // #077384
    "--color-secondary-800": "8 92 102", // #085c66
    "--color-secondary-900": "9 78 86", // #094e56
    // tertiary | #FF6B35
    "--color-tertiary-50": "255 239 232", // #ffefe8
    "--color-tertiary-100": "255 218 204", // #ffdacb
    "--color-tertiary-200": "255 191 166", // #ffbfa6
    "--color-tertiary-300": "255 153 102", // #ff9966
    "--color-tertiary-400": "255 107 53", // #FF6B35
    "--color-tertiary-500": "234 84 32", // #ea5420
    "--color-tertiary-600": "204 72 24", // #cc4818
    "--color-tertiary-700": "173 60 20", // #ad3c14
    "--color-tertiary-800": "143 48 16", // #8f3010
    "--color-tertiary-900": "112 38 12", // #70260c
    // success | #84cc16
    "--color-success-50": "237 247 220", // #edf7dc
    "--color-success-100": "230 245 208", // #e6f5d0
    "--color-success-200": "224 242 197", // #e0f2c5
    "--color-success-300": "206 235 162", // #ceeba2
    "--color-success-400": "169 219 92", // #a9db5c
    "--color-success-500": "132 204 22", // #84cc16
    "--color-success-600": "119 184 20", // #77b814
    "--color-success-700": "99 153 17", // #639911
    "--color-success-800": "79 122 13", // #4f7a0d
    "--color-success-900": "65 100 11", // #41640b
    // warning | #EAB308
    "--color-warning-50": "252 244 218", // #fcf4da
    "--color-warning-100": "251 240 206", // #fbf0ce
    "--color-warning-200": "250 236 193", // #faecc1
    "--color-warning-300": "247 225 156", // #f7e19c
    "--color-warning-400": "240 202 82", // #f0ca52
    "--color-warning-500": "234 179 8", // #EAB308
    "--color-warning-600": "211 161 7", // #d3a107
    "--color-warning-700": "176 134 6", // #b08606
    "--color-warning-800": "140 107 5", // #8c6b05
    "--color-warning-900": "115 88 4", // #735804
    // error | #D41976
    "--color-error-50": "249 221 234", // #f9ddea
    "--color-error-100": "246 209 228", // #f6d1e4
    "--color-error-200": "244 198 221", // #f4c6dd
    "--color-error-300": "238 163 200", // #eea3c8
    "--color-error-400": "225 94 159", // #e15e9f
    "--color-error-500": "212 25 118", // #D41976
    "--color-error-600": "191 23 106", // #bf176a
    "--color-error-700": "159 19 89", // #9f1359
    "--color-error-800": "127 15 71", // #7f0f47
    "--color-error-900": "104 12 58", // #680c3a
    // surface | #495a8f
    "--color-surface-50": "228 230 238", // #e4e6ee
    "--color-surface-100": "219 222 233", // #dbdee9
    "--color-surface-200": "210 214 227", // #d2d6e3
    "--color-surface-300": "182 189 210", // #b6bdd2
    "--color-surface-400": "128 140 177", // #808cb1
    "--color-surface-500": "73 90 143", // #495a8f
    "--color-surface-600": "66 81 129", // #425181
    "--color-surface-700": "55 68 107", // #37446b
    "--color-surface-800": "44 54 86", // #2c3656
    "--color-surface-900": "36 44 70", // #242c46
  },
};

import { NuxtModule, RuntimeConfig } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtOptions {
    /**
     * Configuration for `@nuxtjs/supabase`
     */
    ["supabase"]: typeof import("@nuxtjs/supabase").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-nodemailer`
     */
    ["nodemailer"]: typeof import("nuxt-nodemailer").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-pdfmake`
     */
    ["pdfmake"]: typeof import("nuxt-pdfmake").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@nuxtjs/supabase`
     */
    ["supabase"]?: typeof import("@nuxtjs/supabase").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-nodemailer`
     */
    ["nodemailer"]?: typeof import("nuxt-nodemailer").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-pdfmake`
     */
    ["pdfmake"]?: typeof import("nuxt-pdfmake").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxtjs/supabase", Exclude<NuxtConfig["supabase"], boolean>] | ["nuxt-nodemailer", Exclude<NuxtConfig["nodemailer"], boolean>] | ["nuxt-pdfmake", Exclude<NuxtConfig["pdfmake"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface NuxtOptions {
    /**
     * Configuration for `@nuxtjs/supabase`
     * @see https://www.npmjs.com/package/@nuxtjs/supabase
     */
    ["supabase"]: typeof import("@nuxtjs/supabase").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-nodemailer`
     * @see https://www.npmjs.com/package/nuxt-nodemailer
     */
    ["nodemailer"]: typeof import("nuxt-nodemailer").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-pdfmake`
     * @see https://www.npmjs.com/package/nuxt-pdfmake
     */
    ["pdfmake"]: typeof import("nuxt-pdfmake").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@nuxtjs/supabase`
     * @see https://www.npmjs.com/package/@nuxtjs/supabase
     */
    ["supabase"]?: typeof import("@nuxtjs/supabase").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-nodemailer`
     * @see https://www.npmjs.com/package/nuxt-nodemailer
     */
    ["nodemailer"]?: typeof import("nuxt-nodemailer").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-pdfmake`
     * @see https://www.npmjs.com/package/nuxt-pdfmake
     */
    ["pdfmake"]?: typeof import("nuxt-pdfmake").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxtjs/supabase", Exclude<NuxtConfig["supabase"], boolean>] | ["nuxt-nodemailer", Exclude<NuxtConfig["nodemailer"], boolean>] | ["nuxt-pdfmake", Exclude<NuxtConfig["pdfmake"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   nitro: {
      envPrefix: string,
   },

   supabase: {
      serviceKey: any,
   },

   nodemailer: {
      transport: {
         host: any,

         port: any,

         secure: boolean,

         auth: {
            user: any,

            pass: any,
         },
      },
   },
  }
  interface PublicRuntimeConfig {
   supabase: {
      url: string,

      key: string,

      redirect: boolean,

      redirectOptions: {
         login: string,

         callback: string,

         exclude: Array<any>,

         cookieRedirect: boolean,
      },

      cookieName: string,

      cookieOptions: {
         maxAge: number,

         sameSite: string,

         secure: boolean,
      },

      clientOptions: any,
   },
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }
// global.d.ts 或 shims-vue.d.ts
declare module '*.module.scss' {
    const content: { [className: string]: string };
    export default content;
}

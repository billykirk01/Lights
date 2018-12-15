export interface scene {
    name?: string,
    uuid?: string,
    states?: {
        selector?: string,
        power?: string,
        brightness?: number,
        color?: {
            hue?: number,
            kelvin?: number,
            saturation?: number
        }
    }[]
}
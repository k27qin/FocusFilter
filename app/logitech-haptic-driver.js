/**
 * logitech-driver.js
 * A reusable ES Module for Logitech Haptic devices.
 */

export class LogitechHapticDriver {
    constructor(options = {}) {
        this.device = null;
        // Configuration defaults based on MX Master specs
        this.config = {
            vendorId: 0x046d,       // Logitech
            productId: 0xb042,      // MX Master 4
            hapticFeatureId: 0x0b4e,
            reportId: 0x11,         // Long report ID
            reportLength: 19,       // Expected buffer length
            deviceIndex: 2,         // Default index for haptics
            ...options
        };
    }

    /**
     * Returns true if the browser supports WebHID.
     */
    get isSupported() {
        return 'hid' in navigator;
    }

    /**
     * Returns the connected device object or null.
     */
    get connectedDevice() {
        return (this.device && this.device.opened) ? this.device : null;
    }

    /**
     * Prompts user to select a device and connects to it.
     */
    async connect() {
        if (!this.isSupported) throw new Error("WebHID not supported");

        const devices = await navigator.hid.requestDevice({
            filters: [{ vendorId: this.config.vendorId, productId: this.config.productId }]
        });

        console.log(devices);

        if (!devices.length) throw new Error("No device selected");

        this.device = devices[0];
        
        if (!this.device.opened) {
            await this.device.open();
        }

        return this.device;
    }

    /**
     * Disconnects the device.
     */
    async disconnect() {
        if (this.connectedDevice) {
            await this.device.close();
        }
        this.device = null;
    }

    /**
     * Sends the haptic command.
     * @param {number} effectId - The ID of the effect (0-255)
     */
    async triggerHaptic(effectId) {
        if (!this.connectedDevice) throw new Error("Device disconnected");

        // Construct the 19-byte payload
        const data = new Uint8Array(this.config.reportLength);
        const view = new DataView(data.buffer);

        view.setUint8(0, this.config.deviceIndex);           // Byte 0: Device Index
        view.setUint16(1, this.config.hapticFeatureId, false); // Byte 1-2: Feature ID (Big Endian)
        view.setUint8(3, effectId);                          // Byte 3: Effect ID

        // Send report (Report ID 0x11)
        await this.device.sendReport(this.config.reportId, data);
    }
}
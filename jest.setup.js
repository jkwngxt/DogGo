// Augment the global namespace with Request
global.Request = class Request extends URL {
    constructor(url, options = {}) {
        super(url);
        this.method = options.method || 'GET';
        this.body = options.body;
    }

    async json() {
        return JSON.parse(this.body);
    }
};

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
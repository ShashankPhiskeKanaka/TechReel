class ServiceMessages {

    public CREATE : { message: string }
    public FETCH: {message: string, error: string}
    public FETCHALL: {message: string, error: string}
    public UPDATE: {message: string}
    public DELETE: {softDelete: string, hardDelete: string}

    constructor (private name: string) {
        this.name;

        this.CREATE = {
            message: `${this.name} record created`,
        }

        this.FETCH = {
            message: `${this.name} record fetched`,
            error: `${this.name} record not found`
        }

        this.FETCHALL = {
            message: `${this.name} records fetched`,
            error: `${this.name} records not found`
        }

        this.UPDATE = {
            message: `${this.name} record updated`,
        }

        this.DELETE = {
            softDelete: `${this.name} record soft deleted`,
            hardDelete: `${this.name} record hard deleted`
        }
    }
}

export { ServiceMessages }
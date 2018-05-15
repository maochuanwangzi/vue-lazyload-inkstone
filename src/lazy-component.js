import { inBrowser } from './util'

export default (lazy) => {
    return {
        props: {
            tag: {
                type: String,
                default: 'div'
            },
            isDirectAccess: {
                type: Boolean,
                default: false
            }
        },
        render (h) {
            if (this.show === false && lazy.options.ssrLoad !== true) {
                return h(this.tag)
            }
            return h(this.tag, this.$slots.default)
        },
        data () {
            return {
                el: null,
                state: {
                    loaded: false
                },
                rect: {},
                show: false
            }
        },
        created () {
            // Handle SSR load
            if (!inBrowser && lazy.options.ssrLoad) {
                this.load()
            }
        },
        mounted () {
            this.el = this.$el
            lazy.addLazyBox(this)
            lazy.lazyLoadHandler()
            // Trigger lazy load when direct access to content
            if (this.isDirectAccess) {
                this.load()
            }
        },
        beforeDestroy () {
            lazy.removeComponent(this)
        },
        methods: {
            getRect () {
                this.rect = this.$el.getBoundingClientRect()
            },
            checkInView () {
                this.getRect()
                return inBrowser &&
                    (this.rect.top < window.innerHeight * lazy.options.preLoad && this.rect.bottom > 0) &&
                    (this.rect.left < window.innerWidth && this.rect.right > 0)
            },
            load () {
                this.show = true
                this.state.loaded = true
                this.$emit('show', this)
            }
        }
    }
}

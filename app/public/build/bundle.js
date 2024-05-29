
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable$1(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable$1(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    var store$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        derived: derived,
        readable: readable,
        writable: writable$1,
        get: get_store_value
    });

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
    }

    var require$$0 = getCjsExportFromNamespace(store$1);

    const writable = require$$0.writable;

    const router$1 = writable({});

    function set(route) {
      router$1.set(route);
    }

    function remove() {
      router$1.set({});
    }

    const activeRoute$1 = {
      subscribe: router$1.subscribe,
      set,
      remove
    };

    var store = { activeRoute: activeRoute$1 };
    var store_1 = store.activeRoute;

    const UrlParser$4 = (urlString, namedUrl = "") => {
      const urlBase = new URL(urlString);

      /**
       * Wrapper for URL.hash
       *
       **/
      function hash() {
        return urlBase.hash;
      }

      /**
       * Wrapper for URL.host
       *
       **/
      function host() {
        return urlBase.host;
      }

      /**
       * Wrapper for URL.hostname
       *
       **/
      function hostname() {
        return urlBase.hostname;
      }

      /**
       * Returns an object with all the named params and their values
       *
       **/
      function namedParams() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values[paramKey.value] = allPathName[paramKey.index];
          return values;
        }, {});
      }

      /**
       * Returns an array with all the named param keys
       *
       **/
      function namedParamsKeys() {
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(paramKey.value);
          return values;
        }, []);
      }

      /**
       * Returns an array with all the named param values
       *
       **/
      function namedParamsValues() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(allPathName[paramKey.index]);
          return values;
        }, []);
      }

      /**
       * Returns an array with all named param ids and their position in the path
       * Private
       **/
      function namedParamsWithIndex() {
        const namedUrlParams = getPathNames(namedUrl);

        return namedUrlParams.reduce((validParams, param, index) => {
          if (param[0] === ":") {
            validParams.push({ value: param.slice(1), index });
          }
          return validParams;
        }, []);
      }

      /**
       * Wrapper for URL.port
       *
       **/
      function port() {
        return urlBase.port;
      }

      /**
       * Wrapper for URL.pathname
       *
       **/
      function pathname() {
        return urlBase.pathname;
      }

      /**
       * Wrapper for URL.protocol
       *
       **/
      function protocol() {
        return urlBase.protocol;
      }

      /**
       * Wrapper for URL.search
       *
       **/
      function search() {
        return urlBase.search;
      }

      /**
       * Returns an object with all query params and their values
       *
       **/
      function queryParams() {
        const params = {};
        urlBase.searchParams.forEach((value, key) => {
          params[key] = value;
        });

        return params;
      }

      /**
       * Returns an array with all the query param keys
       *
       **/
      function queryParamsKeys() {
        const params = [];
        urlBase.searchParams.forEach((_value, key) => {
          params.push(key);
        });

        return params;
      }

      /**
       * Returns an array with all the query param values
       *
       **/
      function queryParamsValues() {
        const params = [];
        urlBase.searchParams.forEach((value) => {
          params.push(value);
        });

        return params;
      }

      /**
       * Returns an array with all the elements of a pathname
       *
       **/
      function pathNames() {
        return getPathNames(urlBase.pathname);
      }

      /**
       * Returns an array with all the parts of a pathname
       * Private method
       **/
      function getPathNames(pathName) {
        if (pathName === "/" || pathName.trim().length === 0) return [pathName];
        if (pathName.slice(-1) === "/") {
          pathName = pathName.slice(0, -1);
        }
        if (pathName[0] === "/") {
          pathName = pathName.slice(1);
        }

        return pathName.split("/");
      }

      return Object.freeze({
        hash: hash(),
        host: host(),
        hostname: hostname(),
        namedParams: namedParams(),
        namedParamsKeys: namedParamsKeys(),
        namedParamsValues: namedParamsValues(),
        pathNames: pathNames(),
        port: port(),
        pathname: pathname(),
        protocol: protocol(),
        search: search(),
        queryParams: queryParams(),
        queryParamsKeys: queryParamsKeys(),
        queryParamsValues: queryParamsValues(),
      });
    };

    var url_parser = { UrlParser: UrlParser$4 };

    const UrlParser$3 = url_parser.UrlParser;

    var urlParamsParser = {
      UrlParser: UrlParser$3
    };

    /**
     * Returns true if object has any nested routes empty
     * @param routeObject
     **/
    function anyEmptyNestedRoutes$1(routeObject) {
      let result = false;
      if (Object.keys(routeObject).length === 0) {
        return true
      }

      if (routeObject.childRoute && Object.keys(routeObject.childRoute).length === 0) {
        result = true;
      } else if (routeObject.childRoute) {
        result = anyEmptyNestedRoutes$1(routeObject.childRoute);
      }

      return result
    }

    /**
     * Compare two routes ignoring named params
     * @param pathName string
     * @param routeName string
     **/

    function compareRoutes(pathName, routeName) {
      routeName = removeSlash$2(routeName);

      if (routeName.includes(':')) {
        return routeName.includes(pathName)
      } else {
        return routeName.startsWith(pathName)
      }
    }

    /**
     * Returns a boolean indicating if the name of path exists in the route based on the language parameter
     * @param pathName string
     * @param route object
     * @param language string
     **/

    function findLocalisedRoute(pathName, route, language) {
      let exists = false;

      if (language) {
        return { exists: route.lang && route.lang[language] && route.lang[language].includes(pathName), language }
      }

      exists = compareRoutes(pathName, route.name);

      if (!exists && route.lang && typeof route.lang === 'object') {
        for (const [key, value] of Object.entries(route.lang)) {
          if (compareRoutes(pathName, value)) {
            exists = true;
            language = key;
          }
        }
      }

      return { exists, language }
    }

    /**
     * Return all the consecutive named param (placeholders) of a pathname
     * @param pathname
     **/
    function getNamedParams$1(pathName = '') {
      if (pathName.trim().length === 0) return []
      const namedUrlParams = getPathNames(pathName);
      return namedUrlParams.reduce((validParams, param) => {
        if (param[0] === ':') {
          validParams.push(param.slice(1));
        }

        return validParams
      }, [])
    }

    /**
     * Split a pathname based on /
     * @param pathName
     * Private method
     **/
    function getPathNames(pathName) {
      if (pathName === '/' || pathName.trim().length === 0) return [pathName]

      pathName = removeSlash$2(pathName, 'both');

      return pathName.split('/')
    }

    /**
     * Return the first part of a pathname until the first named param is found
     * @param name
     **/
    function nameToPath$1(name = '') {
      let routeName;
      if (name === '/' || name.trim().length === 0) return name
      name = removeSlash$2(name, 'lead');
      routeName = name.split(':')[0];
      routeName = removeSlash$2(routeName, 'trail');

      return routeName.toLowerCase()
    }

    /**
     * Return the path name excluding query params
     * @param name
     **/
    function pathWithoutQueryParams$1(currentRoute) {
      const path = currentRoute.path.split('?');
      return path[0]
    }

    /**
     * Return the path name including query params
     * @param name
     **/
    function pathWithQueryParams$1(currentRoute) {
      let queryParams = [];
      if (currentRoute.queryParams) {
        for (let [key, value] of Object.entries(currentRoute.queryParams)) {
          queryParams.push(`${key}=${value}`);
        }
      }

      const hash = currentRoute.hash ? currentRoute.hash : '';

      if (queryParams.length > 0) {
        return `${currentRoute.path}?${queryParams.join('&')}${hash}`
      } else {
        return currentRoute.path + hash
      }
    }

    /**
     * Returns a string with trailing or leading slash character removed
     * @param pathName string
     * @param position string - lead, trail, both
     **/
    function removeExtraPaths$1(pathNames, basePathNames) {
      const names = basePathNames.split('/');
      if (names.length > 1) {
        names.forEach(function (name, index) {
          if (name.length > 0 && index > 0) {
            pathNames.shift();
          }
        });
      }

      return pathNames
    }

    /**
     * Returns a string with trailing or leading slash character removed
     * @param pathName string
     * @param position string - lead, trail, both
     **/

    function removeSlash$2(pathName, position = 'lead') {
      if (pathName.trim().length < 1) {
        return ''
      }

      if (position === 'trail' || position === 'both') {
        if (pathName.slice(-1) === '/') {
          pathName = pathName.slice(0, -1);
        }
      }

      if (position === 'lead' || position === 'both') {
        if (pathName[0] === '/') {
          pathName = pathName.slice(1);
        }
      }

      return pathName
    }

    /**
     * Returns the name of the route based on the language parameter
     * @param route object
     * @param language string
     **/

    function routeNameLocalised$1(route, language = null) {
      if (!language || !route.lang || !route.lang[language]) {
        return route.name
      } else {
        return route.lang[language]
      }
    }

    /**
     * Return the path name excluding query params
     * @param name
     **/
    function startsWithNamedParam$1(currentRoute) {
      const routeName = removeSlash$2(currentRoute);
      return routeName.startsWith(':')
    }

    /**
     * Updates the base route path.
     * Route objects can have nested routes (childRoutes) or just a long name like "admin/employees/show/:id"
     *
     * @param basePath string
     * @param pathNames array
     * @param route object
     * @param language string
     **/

    function updateRoutePath$1(basePath, pathNames, route, language, convert = false) {
      if (basePath === '/' || basePath.trim().length === 0) return { result: basePath, language: null }

      let basePathResult = basePath;
      let routeName = route.name;
      let currentLanguage = language;

      if (convert) {
        currentLanguage = '';
      }

      routeName = removeSlash$2(routeName);
      basePathResult = removeSlash$2(basePathResult);

      if (!route.childRoute) {
        let localisedRoute = findLocalisedRoute(basePathResult, route, currentLanguage);

        if (localisedRoute.exists && convert) {
          basePathResult = routeNameLocalised$1(route, language);
        }

        let routeNames = routeName.split(':')[0];
        routeNames = removeSlash$2(routeNames, 'trail');
        routeNames = routeNames.split('/');
        routeNames.shift();
        routeNames.forEach(() => {
          const currentPathName = pathNames[0];
          localisedRoute = findLocalisedRoute(`${basePathResult}/${currentPathName}`, route, currentLanguage);

          if (currentPathName && localisedRoute.exists) {
            if (convert) {
              basePathResult = routeNameLocalised$1(route, language);
            } else {
              basePathResult = `${basePathResult}/${currentPathName}`;
            }
            pathNames.shift();
          } else {
            return { result: basePathResult, language: localisedRoute.language }
          }
        });
        return { result: basePathResult, language: localisedRoute.language }
      } else {
        return { result: basePath, language: currentLanguage }
      }
    }

    var utils = {
      anyEmptyNestedRoutes: anyEmptyNestedRoutes$1,
      compareRoutes,
      findLocalisedRoute,
      getNamedParams: getNamedParams$1,
      getPathNames,
      nameToPath: nameToPath$1,
      pathWithQueryParams: pathWithQueryParams$1,
      pathWithoutQueryParams: pathWithoutQueryParams$1,
      removeExtraPaths: removeExtraPaths$1,
      removeSlash: removeSlash$2,
      routeNameLocalised: routeNameLocalised$1,
      startsWithNamedParam: startsWithNamedParam$1,
      updateRoutePath: updateRoutePath$1,
    };
    var utils_1 = utils.anyEmptyNestedRoutes;

    const { UrlParser: UrlParser$2 } = urlParamsParser;

    const { pathWithQueryParams, removeSlash: removeSlash$1 } = utils;

    function RouterCurrent$1(trackPage) {
      const trackPageview = trackPage || false;
      let activeRoute = '';

      function setActive(newRoute, updateBrowserHistory) {
        activeRoute = newRoute.path;
        pushActiveRoute(newRoute, updateBrowserHistory);
      }

      function active() {
        return activeRoute
      }

      /**
       * Returns true if pathName is current active route
       * @param pathName String The path name to check against the current route.
       * @param includePath Boolean if true checks that pathName is included in current route. If false should match it.
       **/
      function isActive(queryPath, includePath = false) {
        if (queryPath[0] !== '/') {
          queryPath = '/' + queryPath;
        }

        // remove query params for comparison
        let pathName = UrlParser$2(`http://fake.com${queryPath}`).pathname;
        let activeRoutePath = UrlParser$2(`http://fake.com${activeRoute}`).pathname;

        pathName = removeSlash$1(pathName, 'trail');

        activeRoutePath = removeSlash$1(activeRoutePath, 'trail');

        if (includePath) {
          return activeRoutePath.includes(pathName)
        } else {
          return activeRoutePath === pathName
        }
      }

      function pushActiveRoute(newRoute, updateBrowserHistory) {
        if (typeof window !== 'undefined') {
          const pathAndSearch = pathWithQueryParams(newRoute);

          if (updateBrowserHistory) {
            window.history.pushState({ page: pathAndSearch }, '', pathAndSearch);
          }
          // Moving back in history does not update browser history but does update tracking.
          if (trackPageview) {
            gaTracking(pathAndSearch);
          }
        }
      }

      function gaTracking(newPage) {
        if (typeof ga !== 'undefined') {
          ga('set', 'page', newPage);
          ga('send', 'pageview');
        }
      }

      return Object.freeze({ active, isActive, setActive })
    }

    var current = { RouterCurrent: RouterCurrent$1 };

    function RouterGuard$1(onlyIf) {
      const guardInfo = onlyIf;

      function valid() {
        return guardInfo && guardInfo.guard && typeof guardInfo.guard === 'function'
      }

      function redirect() {
        return !guardInfo.guard()
      }

      function redirectPath() {
        let destinationUrl = '/';
        if (guardInfo.redirect && guardInfo.redirect.length > 0) {
          destinationUrl = guardInfo.redirect;
        }

        return destinationUrl
      }

      return Object.freeze({ valid, redirect, redirectPath })
    }

    var guard = { RouterGuard: RouterGuard$1 };

    const { RouterGuard } = guard;

    function RouterRedirect$1(route, currentPath) {
      const guard = RouterGuard(route.onlyIf);

      function path() {
        let redirectTo = currentPath;
        if (route.redirectTo && route.redirectTo.length > 0) {
          redirectTo = route.redirectTo;
        }

        if (guard.valid() && guard.redirect()) {
          redirectTo = guard.redirectPath();
        }

        return redirectTo
      }

      return Object.freeze({ path })
    }

    var redirect = { RouterRedirect: RouterRedirect$1 };

    const { UrlParser: UrlParser$1 } = urlParamsParser;

    function RouterRoute$1({ routeInfo, path, routeNamedParams, urlParser, namedPath, language }) {
      function namedParams() {
        const parsedParams = UrlParser$1(`https://fake.com${urlParser.pathname}`, namedPath).namedParams;

        return { ...routeNamedParams, ...parsedParams }
      }

      function get() {
        return {
          name: path,
          component: routeInfo.component,
          hash: urlParser.hash,
          layout: routeInfo.layout,
          queryParams: urlParser.queryParams,
          namedParams: namedParams(),
          path,
          language
        }
      }

      return Object.freeze({ get, namedParams })
    }

    var route$1 = { RouterRoute: RouterRoute$1 };

    const { updateRoutePath, getNamedParams, nameToPath, removeExtraPaths, routeNameLocalised } = utils;

    function RouterPath$1({ basePath, basePathName, pathNames, convert, currentLanguage }) {
      let updatedPathRoute;
      let route;
      let routePathLanguage = currentLanguage;

      function updatedPath(currentRoute) {
        route = currentRoute;
        updatedPathRoute = updateRoutePath(basePathName, pathNames, route, routePathLanguage, convert);
        routePathLanguage = convert ? currentLanguage : updatedPathRoute.language;

        return updatedPathRoute
      }

      function localisedPathName() {
        return routeNameLocalised(route, routePathLanguage)
      }

      function localisedRouteWithoutNamedParams() {
        return nameToPath(localisedPathName())
      }

      function basePathNameWithoutNamedParams() {
        return nameToPath(updatedPathRoute.result)
      }

      function namedPath() {
        const localisedPath = localisedPathName();

        return basePath ? `${basePath}/${localisedPath}` : localisedPath
      }

      function routePath() {
        let routePathValue = `${basePath}/${basePathNameWithoutNamedParams()}`;
        if (routePathValue === '//') {
          routePathValue = '/';
        }

        if (routePathLanguage) {
          pathNames = removeExtraPaths(pathNames, localisedRouteWithoutNamedParams());
        }

        const namedParams = getNamedParams(localisedPathName());
        if (namedParams && namedParams.length > 0) {
          namedParams.forEach(function () {
            if (pathNames.length > 0) {
              routePathValue += `/${pathNames.shift()}`;
            }
          });
        }

        return routePathValue
      }

      function routeLanguage() {
        return routePathLanguage
      }

      function basePathSameAsLocalised() {
        return basePathNameWithoutNamedParams() === localisedRouteWithoutNamedParams()
      }

      return Object.freeze({
        basePathSameAsLocalised,
        updatedPath,
        basePathNameWithoutNamedParams,
        localisedPathName,
        localisedRouteWithoutNamedParams,
        namedPath,
        pathNames,
        routeLanguage,
        routePath,
      })
    }

    var path = { RouterPath: RouterPath$1 };

    const { UrlParser } = urlParamsParser;

    const { RouterRedirect } = redirect;
    const { RouterRoute } = route$1;
    const { RouterPath } = path;
    const { anyEmptyNestedRoutes, pathWithoutQueryParams, startsWithNamedParam } = utils;

    const NotFoundPage$1 = '/404.html';

    function RouterFinder$1({ routes, currentUrl, routerOptions, convert }) {
      const defaultLanguage = routerOptions.defaultLanguage;
      const sitePrefix = routerOptions.prefix ? routerOptions.prefix.toLowerCase() : '';
      const urlParser = parseCurrentUrl(currentUrl, sitePrefix);
      let redirectTo = '';
      let routeNamedParams = {};
      let staticParamMatch = false;

      function findActiveRoute() {
        let searchActiveRoute = searchActiveRoutes(routes, '', urlParser.pathNames, routerOptions.lang, convert);

        if (!searchActiveRoute || !Object.keys(searchActiveRoute).length || anyEmptyNestedRoutes(searchActiveRoute)) {
          if (typeof window !== 'undefined') {
            searchActiveRoute = routeNotFound(routerOptions.lang);
          }
        } else {
          searchActiveRoute.path = pathWithoutQueryParams(searchActiveRoute);
          if (sitePrefix) {
            searchActiveRoute.path = `/${sitePrefix}${searchActiveRoute.path}`;
          }
        }

        return searchActiveRoute
      }

      /**
       * Gets an array of routes and the browser pathname and return the active route
       * @param routes
       * @param basePath
       * @param pathNames
       **/
      function searchActiveRoutes(routes, basePath, pathNames, currentLanguage, convert) {
        let currentRoute = {};
        let basePathName = pathNames.shift().toLowerCase();
        const routerPath = RouterPath({ basePath, basePathName, pathNames, convert, currentLanguage });
        staticParamMatch = false;

        routes.forEach(function (route) {
          routerPath.updatedPath(route);
          if (matchRoute(routerPath, route.name)) {
            let routePath = routerPath.routePath();
            redirectTo = RouterRedirect(route, redirectTo).path();

            if (currentRoute.name !== routePath) {
              currentRoute = setCurrentRoute({
                route,
                routePath,
                routeLanguage: routerPath.routeLanguage(),
                urlParser,
                namedPath: routerPath.namedPath(),
              });
            }

            if (route.nestedRoutes && route.nestedRoutes.length > 0 && routerPath.pathNames.length > 0) {
              currentRoute.childRoute = searchActiveRoutes(
                route.nestedRoutes,
                routePath,
                routerPath.pathNames,
                routerPath.routeLanguage(),
                convert
              );
              currentRoute.path = currentRoute.childRoute.path;
              currentRoute.language = currentRoute.childRoute.language;
            } else if (nestedRoutesAndNoPath(route, routerPath.pathNames)) {
              const indexRoute = searchActiveRoutes(
                route.nestedRoutes,
                routePath,
                ['index'],
                routerPath.routeLanguage(),
                convert
              );
              if (indexRoute && Object.keys(indexRoute).length > 0) {
                currentRoute.childRoute = indexRoute;
                currentRoute.language = currentRoute.childRoute.language;
              }
            }
          }
        });

        if (redirectTo) {
          currentRoute.redirectTo = redirectTo;
        }

        return currentRoute
      }

      function matchRoute(routerPath, routeName) {
        const basePathSameAsLocalised = routerPath.basePathSameAsLocalised();
        if (basePathSameAsLocalised) {
          staticParamMatch = true;
        }

        return basePathSameAsLocalised || (!staticParamMatch && startsWithNamedParam(routeName))
      }

      function nestedRoutesAndNoPath(route, pathNames) {
        return route.nestedRoutes && route.nestedRoutes.length > 0 && pathNames.length === 0
      }

      function parseCurrentUrl(currentUrl, sitePrefix) {
        if (sitePrefix && sitePrefix.trim().length > 0) {
          const noPrefixUrl = currentUrl.replace(sitePrefix + '/', '');
          return UrlParser(noPrefixUrl)
        } else {
          return UrlParser(currentUrl)
        }
      }

      function setCurrentRoute({ route, routePath, routeLanguage, urlParser, namedPath }) {
        const routerRoute = RouterRoute({
          routeInfo: route,
          urlParser,
          path: routePath,
          routeNamedParams,
          namedPath,
          language: routeLanguage || defaultLanguage,
        });
        routeNamedParams = routerRoute.namedParams();

        return routerRoute.get()
      }

      function routeNotFound(customLanguage) {
        const custom404Page = routes.find((route) => route.name == '404');
        const language = customLanguage || defaultLanguage || '';
        if (custom404Page) {
          return { ...custom404Page, language, path: '404' }
        } else {
          return { name: '404', component: '', path: '404', redirectTo: NotFoundPage$1 }
        }
      }

      return Object.freeze({ findActiveRoute })
    }

    var finder = { RouterFinder: RouterFinder$1 };

    const { activeRoute } = store;
    const { RouterCurrent } = current;
    const { RouterFinder } = finder;
    const { removeSlash } = utils;

    const NotFoundPage = '/404.html';

    let userDefinedRoutes = [];
    let routerOptions = {};
    let routerCurrent;

    /**
     * Object exposes one single property: activeRoute
     * @param routes  Array of routes
     * @param currentUrl current url
     * @param options configuration options
     **/
    function SpaRouter$1(routes, currentUrl, options = {}) {
      routerOptions = { ...options };
      if (typeof currentUrl === 'undefined' || currentUrl === '') {
        currentUrl = document.location.href;
      }

      routerCurrent = RouterCurrent(routerOptions.gaPageviews);

      currentUrl = removeSlash(currentUrl, 'trail');
      userDefinedRoutes = routes;

      function findActiveRoute() {
        let convert = false;

        if (routerOptions.langConvertTo) {
          routerOptions.lang = routerOptions.langConvertTo;
          convert = true;
        }

        return RouterFinder({ routes, currentUrl, routerOptions, convert }).findActiveRoute()
      }

      /**
       * Redirect current route to another
       * @param destinationUrl
       **/
      function navigateNow(destinationUrl, updateBrowserHistory) {
        if (typeof window !== 'undefined') {
          if (destinationUrl === NotFoundPage) {
            routerCurrent.setActive({ path: NotFoundPage }, updateBrowserHistory);
          } else {
            navigateTo$1(destinationUrl);
          }
        }

        return destinationUrl
      }

      function setActiveRoute(updateBrowserHistory = true) {
        const currentRoute = findActiveRoute();
        if (currentRoute.redirectTo) {
          return navigateNow(currentRoute.redirectTo, updateBrowserHistory)
        }

        routerCurrent.setActive(currentRoute, updateBrowserHistory);
        activeRoute.set(currentRoute);

        return currentRoute
      }

      return Object.freeze({
        setActiveRoute,
        findActiveRoute,
      })
    }

    /**
     * Converts a route to its localised version
     * @param pathName
     **/
    function localisedRoute$1(pathName, language) {
      pathName = removeSlash(pathName, 'lead');
      routerOptions.langConvertTo = language;

      return SpaRouter$1(userDefinedRoutes, 'http://fake.com/' + pathName, routerOptions).findActiveRoute()
    }

    /**
     * Updates the current active route and updates the browser pathname
     * @param pathName String
     * @param language String
     * @param updateBrowserHistory Boolean
     **/
    function navigateTo$1(pathName, language = null, updateBrowserHistory = true) {
      pathName = removeSlash(pathName, 'lead');

      if (language) {
        routerOptions.langConvertTo = language;
      }

      return SpaRouter$1(userDefinedRoutes, 'http://fake.com/' + pathName, routerOptions).setActiveRoute(updateBrowserHistory)
    }

    /**
     * Returns true if pathName is current active route
     * @param pathName String The path name to check against the current route.
     * @param includePath Boolean if true checks that pathName is included in current route. If false should match it.
     **/
    function routeIsActive$1(queryPath, includePath = false) {
      return routerCurrent.isActive(queryPath, includePath)
    }

    if (typeof window !== 'undefined') {
      // Avoid full page reload on local routes
      window.addEventListener('click', (event) => {
        if (event.target.localName.toLowerCase() !== 'a') return
        if (event.metaKey || event.ctrlKey || event.shiftKey) return

        const sitePrefix = routerOptions.prefix ? `/${routerOptions.prefix.toLowerCase()}` : '';
        const targetHostNameInternal = event.target.pathname && event.target.host === window.location.host;
        const prefixMatchPath = sitePrefix.length > 1 ? event.target.pathname.startsWith(sitePrefix) : true;

        if (targetHostNameInternal && prefixMatchPath) {
          event.preventDefault();
          let navigatePathname = event.target.pathname + event.target.search;

          const destinationUrl = navigatePathname + event.target.search + event.target.hash;
          if (event.target.target === '_blank') {
            window.open(destinationUrl, 'newTab');
          } else {
            navigateTo$1(destinationUrl);
          }
        }
      });

      window.onpopstate = function (_event) {
        let navigatePathname = window.location.pathname + window.location.search + window.location.hash;

        navigateTo$1(navigatePathname, null, false);
      };
    }

    var spa_router = { SpaRouter: SpaRouter$1, localisedRoute: localisedRoute$1, navigateTo: navigateTo$1, routeIsActive: routeIsActive$1 };
    var spa_router_1 = spa_router.SpaRouter;
    var spa_router_2 = spa_router.localisedRoute;
    var spa_router_3 = spa_router.navigateTo;
    var spa_router_4 = spa_router.routeIsActive;

    /* node_modules\svelte-router-spa\src\components\route.svelte generated by Svelte v3.49.0 */

    // (10:34) 
    function create_if_block_2$6(ctx) {
    	let route;
    	let current;

    	route = new Route$1({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0].childRoute,
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0].childRoute;
    			if (dirty & /*params*/ 2) route_changes.params = /*params*/ ctx[1];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(10:34) ",
    		ctx
    	});

    	return block;
    }

    // (8:33) 
    function create_if_block_1$b(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].component;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: {
    					.../*currentRoute*/ ctx[0],
    					component: ''
    				},
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = {
    				.../*currentRoute*/ ctx[0],
    				component: ''
    			};

    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(8:33) ",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if currentRoute.layout}
    function create_if_block$g(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].layout;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: { .../*currentRoute*/ ctx[0], layout: '' },
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = { .../*currentRoute*/ ctx[0], layout: '' };
    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].layout)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(6:0) {#if currentRoute.layout}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$g, create_if_block_1$b, create_if_block_2$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentRoute*/ ctx[0].layout) return 0;
    		if (/*currentRoute*/ ctx[0].component) return 1;
    		if (/*currentRoute*/ ctx[0].childRoute) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, []);
    	let { currentRoute = {} } = $$props;
    	let { params = {} } = $$props;
    	const writable_props = ['currentRoute', 'params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({ currentRoute, params });

    	$$self.$inject_state = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentRoute, params];
    }

    class Route$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { currentRoute: 0, params: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get currentRoute() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get params() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var route = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Route$1
    });

    /* node_modules\svelte-router-spa\src\components\router.svelte generated by Svelte v3.49.0 */

    function create_fragment$n(ctx) {
    	let route;
    	let current;

    	route = new Route$1({
    			props: { currentRoute: /*$activeRoute*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*$activeRoute*/ 1) route_changes.currentRoute = /*$activeRoute*/ ctx[0];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	validate_store(store_1, 'activeRoute');
    	component_subscribe($$self, store_1, $$value => $$invalidate(0, $activeRoute = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = [] } = $$props;
    	let { options = {} } = $$props;

    	onMount(function () {
    		spa_router_1(routes, document.location.href, options).setActiveRoute();
    	});

    	const writable_props = ['routes', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(1, routes = $$props.routes);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		SpaRouter: spa_router_1,
    		Route: Route$1,
    		activeRoute: store_1,
    		routes,
    		options,
    		$activeRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(1, routes = $$props.routes);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$activeRoute, routes, options];
    }

    class Router$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { routes: 1, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get routes() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var router = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Router$1
    });

    /* node_modules\svelte-router-spa\src\components\navigate.svelte generated by Svelte v3.49.0 */
    const file$m = "node_modules\\svelte-router-spa\\src\\components\\navigate.svelte";

    function create_fragment$m(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*to*/ ctx[0]);
    			attr_dev(a, "title", /*title*/ ctx[1]);
    			attr_dev(a, "class", /*styles*/ ctx[2]);
    			toggle_class(a, "active", spa_router_4(/*to*/ ctx[0]));
    			add_location(a, file$m, 25, 0, 548);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*navigate*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*to*/ 1) {
    				attr_dev(a, "href", /*to*/ ctx[0]);
    			}

    			if (!current || dirty & /*title*/ 2) {
    				attr_dev(a, "title", /*title*/ ctx[1]);
    			}

    			if (!current || dirty & /*styles*/ 4) {
    				attr_dev(a, "class", /*styles*/ ctx[2]);
    			}

    			if (dirty & /*styles, routeIsActive, to*/ 5) {
    				toggle_class(a, "active", spa_router_4(/*to*/ ctx[0]));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigate', slots, ['default']);
    	let { to = '/' } = $$props;
    	let { title = '' } = $$props;
    	let { styles = '' } = $$props;
    	let { lang = null } = $$props;

    	onMount(function () {
    		if (lang) {
    			const route = spa_router_2(to, lang);

    			if (route) {
    				$$invalidate(0, to = route.path);
    			}
    		}
    	});

    	function navigate(event) {
    		if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    		event.preventDefault();
    		event.stopPropagation();
    		spa_router_3(to);
    	}

    	const writable_props = ['to', 'title', 'styles', 'lang'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigate> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('styles' in $$props) $$invalidate(2, styles = $$props.styles);
    		if ('lang' in $$props) $$invalidate(4, lang = $$props.lang);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		localisedRoute: spa_router_2,
    		navigateTo: spa_router_3,
    		routeIsActive: spa_router_4,
    		to,
    		title,
    		styles,
    		lang,
    		navigate
    	});

    	$$self.$inject_state = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('styles' in $$props) $$invalidate(2, styles = $$props.styles);
    		if ('lang' in $$props) $$invalidate(4, lang = $$props.lang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [to, title, styles, navigate, lang, $$scope, slots];
    }

    class Navigate$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { to: 0, title: 1, styles: 2, lang: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigate",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get to() {
    		throw new Error("<Navigate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Navigate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Navigate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Navigate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styles() {
    		throw new Error("<Navigate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<Navigate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lang() {
    		throw new Error("<Navigate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Navigate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var navigate = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Navigate$1
    });

    var Route = getCjsExportFromNamespace(route);

    var Router = getCjsExportFromNamespace(router);

    var Navigate = getCjsExportFromNamespace(navigate);

    const { SpaRouter, navigateTo, localisedRoute, routeIsActive } = spa_router;




    var src = {
      SpaRouter,
      localisedRoute,
      navigateTo,
      routeIsActive,
      Route,
      Router,
      Navigate
    };
    var src_3 = src.navigateTo;
    var src_5 = src.Route;
    var src_6 = src.Router;
    var src_7 = src.Navigate;

    function e(e){this.message=e;}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw "Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e;}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";

    const url = "https://pickem-api-production.up.railway.app/api";

    const login = async (user) => {
      const response = await makeUnauthenticatedRequest(`${url}/users/login`, "POST", JSON.stringify(user));
      return response.json();
    };

    const register = async (user) => {
      const response = await makeUnauthenticatedRequest(`${url}/users/register`, "POST", JSON.stringify(user));
      return response.json();
    };

    const fetchGames = async (season, seasonType, week) => {
      const response = await makeUnauthenticatedRequest(`${url}/games?season=${season}&seasonType=${seasonType}&week=${week}`, "GET");
      return response.json();
    };

    const fetchGame = async (id) => {
      const response = await makeUnauthenticatedRequest(`${url}/games/${id}`, "GET");
      return response.json();
    };

    const fetchGamesForCurrentWeek = async () => {
      const response = await makeUnauthenticatedRequest(`${url}/games/currentWeek`, "GET");
      return response.json();
    };

    const fetchBets = async (season, seasonType, week, user) => {
      const response = await makeAuthenticatedRequest(
        `${url}/bets?game.season=${season}&game.seasonType=${seasonType}&game.week=${week}&user.id=${user.id}`,
        "GET",
        null,
        user
      );
      return response.json();
    };

    const makeBets = async (bets, user) => {
      var body = [];
      Object.keys(bets).forEach((k) => {
        body.push({
          userId: user.id,
          gameId: k,
          winningTeamId: bets[k],
        });
      });

      await makeAuthenticatedRequest(`${url}/bets`, "POST", JSON.stringify(body), user); //TODO: Error handling?
    };

    const createLeague = async (name, user) => {
      const body = { name };
      const response = await makeAuthenticatedRequest(`${url}/leagues`, "POST", JSON.stringify(body), user);
      return response.json();
    };

    const fetchLeagues = async (user) => {
      const response = await makeAuthenticatedRequest(`${url}/leagues`, "GET", null, user);
      return response.json();
    };

    const fetchLeague = async (user, leagueId) => {
      const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}`, "GET", null, user);
      return response.json();
    };

    const joinLeague = async (user, leagueId) => {
      const body = {
        userId: user.id,
      };
      const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}/join`, "PUT", JSON.stringify(body), user);
      return response.json();
    };

    const deleteLeague = async (user, leagueId) => {
      const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}`, "DELETE", null, user);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    };

    const getStatistics = async (user, season) => {
      const response = await makeAuthenticatedRequest(`${url}/statistics?season=${season}`, "GET", null, user);
      return response.json();
    };

    const getProfile = async (user) => {
      const response = await makeAuthenticatedRequest(`${url}/users/me`, "GET", null, user);
      return response.json();
    };

    const makeUnauthenticatedRequest = async (url, method, body) => {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return response;
    };
    const makeAuthenticatedRequest = async (url, method, body, user) => {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`, //TODO: I don't want to have to to this.
      };
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return response;
    };

    const storedUser = JSON.parse(localStorage.getItem("pickem:user"));
    const loggedInUser = writable$1(storedUser);
    loggedInUser.subscribe((value) => {
      localStorage.setItem("pickem:user", JSON.stringify(value));
    });

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    const createToast = () => {
      const { subscribe, update } = writable$1([]);
      let count = 0;
      let defaults = {};
      const push = (msg, opts = {}) => {
        const entry = { id: ++count, msg: msg, ...defaults, ...opts, theme: { ...defaults.theme, ...opts.theme } };
        update(n => entry.reversed ? [...n, entry] : [entry, ...n]);
        return count
      };
      const pop = id => {
        update(n => id ? n.filter(i => i.id !== id) : n.splice(1));
      };
      const set = (id, obj) => {
        update(n => {
          const idx = n.findIndex(i => i.id === id);
          if (idx > -1) {
            n[idx] = { ...n[idx], ...obj };
          }
          return n
        });
      };
      const _opts = (obj = {}) => {
        defaults = { ...defaults, ...obj, theme: { ...defaults.theme, ...obj.theme } };
        return defaults
      };
      return { subscribe, push, pop, set, _opts }
    };

    const toast = createToast();

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable$1(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* node_modules\@zerodevx\svelte-toast\src\ToastItem.svelte generated by Svelte v3.49.0 */
    const file$l = "node_modules\\@zerodevx\\svelte-toast\\src\\ToastItem.svelte";

    // (80:2) {#if item.dismissable}
    function create_if_block$f(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "✕";
    			attr_dev(div, "class", "_toastBtn svelte-vfz6wa");
    			attr_dev(div, "role", "button");
    			attr_dev(div, "tabindex", "-1");
    			add_location(div, file$l, 80, 2, 1871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(80:2) {#if item.dismissable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*item*/ ctx[0].msg + "";
    	let t0;
    	let t1;
    	let t2;
    	let progress_1;
    	let if_block = /*item*/ ctx[0].dismissable && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			progress_1 = element("progress");
    			attr_dev(div0, "class", "_toastMsg svelte-vfz6wa");
    			add_location(div0, file$l, 77, 2, 1803);
    			attr_dev(progress_1, "class", "_toastBar svelte-vfz6wa");
    			progress_1.value = /*$progress*/ ctx[1];
    			add_location(progress_1, file$l, 83, 2, 1977);
    			attr_dev(div1, "class", "_toastItem svelte-vfz6wa");
    			add_location(div1, file$l, 76, 0, 1776);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, progress_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && t0_value !== (t0_value = /*item*/ ctx[0].msg + "")) set_data_dev(t0, t0_value);

    			if (/*item*/ ctx[0].dismissable) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$f(ctx);
    					if_block.c();
    					if_block.m(div1, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$progress*/ 2) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastItem', slots, []);
    	let { item } = $$props;
    	const progress = tweened(item.initial, { duration: item.duration, easing: identity });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(1, $progress = value));
    	let prevProgress = item.initial;
    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toast.pop(item.id);

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		linear: identity,
    		toast,
    		item,
    		progress,
    		prevProgress,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('prevProgress' in $$props) $$invalidate(3, prevProgress = $$props.prevProgress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*prevProgress, item*/ 9) {
    			if (prevProgress !== item.progress) {
    				if (item.progress === 1 || item.progress === 0) {
    					progress.set(item.progress).then(() => toast.pop(item.id));
    				} else {
    					progress.set(item.progress);
    				}

    				$$invalidate(3, prevProgress = item.progress);
    			}
    		}
    	};

    	return [item, $progress, progress, prevProgress, click_handler];
    }

    class ToastItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastItem",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ToastItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<ToastItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ToastItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@zerodevx\svelte-toast\src\SvelteToast.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$4 } = globals;
    const file$k = "node_modules\\@zerodevx\\svelte-toast\\src\\SvelteToast.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (39:2) {#each $toast as item (item.id)}
    function create_each_block$8(key_1, ctx) {
    	let li;
    	let toastitem;
    	let t;
    	let li_style_value;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	toastitem = new ToastItem({
    			props: { item: /*item*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			create_component(toastitem.$$.fragment);
    			t = space();
    			attr_dev(li, "style", li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[4].theme));
    			add_location(li, file$k, 39, 2, 830);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(toastitem, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const toastitem_changes = {};
    			if (dirty & /*$toast*/ 1) toastitem_changes.item = /*item*/ ctx[4];
    			toastitem.$set(toastitem_changes);

    			if (!current || dirty & /*$toast*/ 1 && li_style_value !== (li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[4].theme))) {
    				attr_dev(li, "style", li_style_value);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, { duration: 200 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				li_intro = create_in_transition(li, fly, /*item*/ ctx[4].intro);
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastitem.$$.fragment, local);
    			if (li_intro) li_intro.invalidate();
    			li_outro = create_out_transition(li, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(toastitem);
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(39:2) {#each $toast as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$toast*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context$8, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$8(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$8(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-ivwmun");
    			add_location(ul, file$k, 37, 0, 788);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getCss, $toast*/ 3) {
    				each_value = /*$toast*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$8, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block$8, null, get_each_context$8);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $toast;
    	validate_store(toast, 'toast');
    	component_subscribe($$self, toast, $$value => $$invalidate(0, $toast = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteToast', slots, []);
    	let { options = {} } = $$props;

    	const defaults = {
    		duration: 4000,
    		dismissable: true,
    		initial: 1,
    		progress: 0,
    		reversed: false,
    		intro: { x: 256 },
    		theme: {}
    	};

    	toast._opts(defaults);
    	const getCss = theme => Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, '');
    	const writable_props = ['options'];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		flip,
    		toast,
    		ToastItem,
    		options,
    		defaults,
    		getCss,
    		$toast
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options*/ 4) {
    			toast._opts(options);
    		}
    	};

    	return [$toast, getCss, options];
    }

    class SvelteToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteToast",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get options() {
    		throw new Error("<SvelteToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SvelteToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\LoadingIndicator.svelte generated by Svelte v3.49.0 */

    const file$j = "src\\LoadingIndicator.svelte";

    function create_fragment$j(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "spinner svelte-c38ilt");
    			add_location(div, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingIndicator', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingIndicator> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoadingIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingIndicator",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\Login.svelte generated by Svelte v3.49.0 */
    const file$i = "src\\Login.svelte";

    // (79:4) {:else}
    function create_else_block$b(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let form;
    	let div1;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div3;
    	let button;
    	let div2;
    	let t8;
    	let t9;
    	let span;
    	let t10;
    	let b;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*loading*/ ctx[3] && create_if_block_2$5(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Login";
    			t1 = space();
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div3 = element("div");
    			button = element("button");
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t8 = text("\r\n            Login");
    			t9 = space();
    			span = element("span");
    			t10 = text("or ");
    			b = element("b");
    			b.textContent = "Register";
    			add_location(h1, file$i, 80, 8, 2238);
    			attr_dev(div0, "class", "title svelte-cywihx");
    			add_location(div0, file$i, 79, 6, 2209);
    			attr_dev(label0, "for", "username");
    			attr_dev(label0, "class", "svelte-cywihx");
    			add_location(label0, file$i, 84, 10, 2344);
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-cywihx");
    			add_location(input0, file$i, 85, 10, 2394);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "svelte-cywihx");
    			add_location(label1, file$i, 86, 10, 2463);
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "svelte-cywihx");
    			add_location(input1, file$i, 87, 10, 2513);
    			add_location(div1, file$i, 83, 8, 2327);
    			attr_dev(div2, "class", "loading svelte-cywihx");
    			add_location(div2, file$i, 91, 12, 2661);
    			attr_dev(button, "class", "svelte-cywihx");
    			add_location(button, file$i, 90, 10, 2639);
    			attr_dev(div3, "class", "action-button svelte-cywihx");
    			add_location(div3, file$i, 89, 8, 2600);
    			add_location(form, file$i, 82, 6, 2274);
    			add_location(b, file$i, 100, 57, 2920);
    			attr_dev(span, "class", "span-button svelte-cywihx");
    			add_location(span, file$i, 100, 6, 2869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(div1, t4);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form, t7);
    			append_dev(form, div3);
    			append_dev(div3, button);
    			append_dev(button, div2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(button, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t10);
    			append_dev(span, b);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[10]),
    					listen_dev(form, "submit", prevent_default(/*loginUser*/ ctx[5]), false, true, false),
    					listen_dev(span, "click", /*toggleMode*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			if (/*loading*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*loading*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(span);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$b.name,
    		type: "else",
    		source: "(79:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (58:4) {#if registerToggled}
    function create_if_block$e(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let form;
    	let div1;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let button;
    	let div2;
    	let t8;
    	let t9;
    	let span;
    	let t10;
    	let b;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*loading*/ ctx[3] && create_if_block_1$a(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Register";
    			t1 = space();
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			button = element("button");
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t8 = text("\r\n          Register");
    			t9 = space();
    			span = element("span");
    			t10 = text("or ");
    			b = element("b");
    			b.textContent = "Login";
    			add_location(h1, file$i, 59, 8, 1547);
    			attr_dev(div0, "class", "title svelte-cywihx");
    			add_location(div0, file$i, 58, 6, 1518);
    			attr_dev(label0, "for", "username");
    			attr_dev(label0, "class", "svelte-cywihx");
    			add_location(label0, file$i, 63, 10, 1659);
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-cywihx");
    			add_location(input0, file$i, 64, 10, 1709);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "svelte-cywihx");
    			add_location(label1, file$i, 65, 10, 1778);
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "svelte-cywihx");
    			add_location(input1, file$i, 66, 10, 1828);
    			add_location(div1, file$i, 62, 8, 1642);
    			attr_dev(div2, "class", "loading svelte-cywihx");
    			add_location(div2, file$i, 69, 10, 1935);
    			attr_dev(button, "class", "svelte-cywihx");
    			add_location(button, file$i, 68, 8, 1915);
    			add_location(form, file$i, 61, 6, 1586);
    			add_location(b, file$i, 77, 57, 2169);
    			attr_dev(span, "class", "span-button svelte-cywihx");
    			add_location(span, file$i, 77, 6, 2118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(div1, t4);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form, t7);
    			append_dev(form, button);
    			append_dev(button, div2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(button, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t10);
    			append_dev(span, b);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(form, "submit", prevent_default(/*registerUser*/ ctx[6]), false, true, false),
    					listen_dev(span, "click", /*toggleMode*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			if (/*loading*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*loading*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(span);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(58:4) {#if registerToggled}",
    		ctx
    	});

    	return block;
    }

    // (93:14) {#if loading}
    function create_if_block_2$5(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(93:14) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (71:12) {#if loading}
    function create_if_block_1$a(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(71:12) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let sveltetoast;
    	let current;
    	const if_block_creators = [create_if_block$e, create_else_block$b];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*registerToggled*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	sveltetoast = new SvelteToast({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			create_component(sveltetoast.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "assets/logo-text.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "NFL Pick'em");
    			add_location(img, file$i, 55, 6, 1419);
    			add_location(div0, file$i, 54, 4, 1406);
    			attr_dev(div1, "class", "login svelte-cywihx");
    			add_location(div1, file$i, 53, 2, 1381);
    			attr_dev(main, "class", "container svelte-cywihx");
    			add_location(main, file$i, 52, 0, 1353);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(main, t1);
    			mount_component(sveltetoast, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(sveltetoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(sveltetoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_component(sveltetoast);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(11, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let username;
    	let password;
    	let registerToggled = false;
    	let loading = false;

    	function toggleMode() {
    		$$invalidate(2, registerToggled = !registerToggled);
    	}

    	async function loginUser() {
    		try {
    			$$invalidate(3, loading = true);
    			const user = await login({ username, password });
    			set_store_value(loggedInUser, $loggedInUser = user, $loggedInUser);
    			src_3("/");
    		} catch(err) {
    			showError("There was a problem logging in. Please try again");
    		} finally {
    			$$invalidate(3, loading = false);
    		}
    	}

    	async function registerUser() {
    		try {
    			$$invalidate(3, loading = true);
    			const user = await register({ username, password });
    			set_store_value(loggedInUser, $loggedInUser = user, $loggedInUser);
    			src_3("/");
    		} catch(err) {
    			showError("There was a problem when registering. Please try again");
    		} finally {
    			$$invalidate(3, loading = false);
    		}
    	}

    	function showError(errorMessage) {
    		toast.push(errorMessage, {
    			theme: {
    				"--toastBackground": "#f54260",
    				"--toastProgressBackground": "white"
    			}
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	function input0_input_handler_1() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler_1() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		login,
    		register,
    		loggedInUser,
    		navigateTo: src_3,
    		SvelteToast,
    		toast,
    		LoadingIndicator,
    		username,
    		password,
    		registerToggled,
    		loading,
    		toggleMode,
    		loginUser,
    		registerUser,
    		showError,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('registerToggled' in $$props) $$invalidate(2, registerToggled = $$props.registerToggled);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		username,
    		password,
    		registerToggled,
    		loading,
    		toggleMode,
    		loginUser,
    		registerUser,
    		input0_input_handler,
    		input1_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\Leagues\CreateLeagues.svelte generated by Svelte v3.49.0 */
    const file$h = "src\\Leagues\\CreateLeagues.svelte";

    // (27:0) {:else}
    function create_else_block$a(ctx) {
    	let h2;
    	let t1;
    	let label;
    	let t3;
    	let input;
    	let t4;
    	let div;
    	let button0;
    	let t6;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Create a league";
    			t1 = space();
    			label = element("label");
    			label.textContent = "Name";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Create";
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			add_location(h2, file$h, 27, 2, 739);
    			attr_dev(label, "for", "name");
    			add_location(label, file$h, 28, 2, 767);
    			attr_dev(input, "id", "name");
    			attr_dev(input, "type", "text");
    			add_location(input, file$h, 29, 2, 801);
    			attr_dev(button0, "class", "button-apply svelte-1743vc8");
    			add_location(button0, file$h, 31, 4, 881);
    			attr_dev(button1, "class", "button-cancel svelte-1743vc8");
    			add_location(button1, file$h, 32, 4, 949);
    			attr_dev(div, "class", "buttons svelte-1743vc8");
    			add_location(div, file$h, 30, 2, 854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*name*/ ctx[0]);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t6);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(button0, "click", /*create*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*cancel*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(27:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if loading}
    function create_if_block$d(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(25:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(5, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreateLeagues', slots, []);
    	const dispatch = createEventDispatcher();
    	let name = "";
    	let loading = false;

    	async function create() {
    		$$invalidate(1, loading = true);
    		const createdLeague = await createLeague(name, $loggedInUser);
    		dispatch("create-league-succeeded", { createdLeague });
    		$$invalidate(1, loading = false);
    		toast.push("League created");
    		cancel();
    	}

    	function cancel() {
    		dispatch("create-league-cancelled");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreateLeagues> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		toast,
    		loggedInUser,
    		createLeague,
    		LoadingIndicator,
    		dispatch,
    		name,
    		loading,
    		create,
    		cancel,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, loading, create, cancel, input_input_handler];
    }

    class CreateLeagues extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreateLeagues",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    function groupByArray(array, key) {
      return array.reduce(function (groups, element) {
        let v = key instanceof Function ? key(element) : element[key];
        let group = groups.find((r) => r && r.key === v);
        if (group) {
          group.values.push(element);
        } else {
          groups.push({ key: v, values: [element] });
        }
        return groups;
      }, []);
    }

    function getCurrentSeason() {
      return 2023;
    }

    function getSeasons() {
      return [2023, 2022, 2021];
    }

    /* src\Leagues\LeagueTable.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$3 } = globals;
    const file$g = "src\\Leagues\\LeagueTable.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (15:8) <Navigate to={`/leagues/${league.id}`}>
    function create_default_slot(ctx) {
    	let t_value = /*league*/ ctx[3].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*leagues*/ 1 && t_value !== (t_value = /*league*/ ctx[3].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(15:8) <Navigate to={`/leagues/${league.id}`}>",
    		ctx
    	});

    	return block;
    }

    // (12:2) {#each leagues as league}
    function create_each_block$7(ctx) {
    	let tr;
    	let td;
    	let navigate;
    	let t;
    	let tr_class_value;
    	let current;

    	navigate = new src_7({
    			props: {
    				to: `/leagues/${/*league*/ ctx[3].id}`,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			create_component(navigate.$$.fragment);
    			t = space();
    			attr_dev(td, "class", "svelte-3wdmem");
    			add_location(td, file$g, 13, 6, 388);

    			attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(/*isLoggedInUserInLeague*/ ctx[1](/*league*/ ctx[3])
    			? "user-in-league"
    			: "") + " svelte-3wdmem"));

    			add_location(tr, file$g, 12, 4, 313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			mount_component(navigate, td, null);
    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navigate_changes = {};
    			if (dirty & /*leagues*/ 1) navigate_changes.to = `/leagues/${/*league*/ ctx[3].id}`;

    			if (dirty & /*$$scope, leagues*/ 65) {
    				navigate_changes.$$scope = { dirty, ctx };
    			}

    			navigate.$set(navigate_changes);

    			if (!current || dirty & /*leagues*/ 1 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*isLoggedInUserInLeague*/ ctx[1](/*league*/ ctx[3])
    			? "user-in-league"
    			: "") + " svelte-3wdmem"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigate.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigate.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(navigate);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(12:2) {#each leagues as league}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let table;
    	let current;
    	let each_value = /*leagues*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "svelte-3wdmem");
    			add_location(table, file$g, 10, 0, 271);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isLoggedInUserInLeague, leagues*/ 3) {
    				each_value = /*leagues*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(table, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(2, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LeagueTable', slots, []);
    	let { leagues = [] } = $$props;

    	function isLoggedInUserInLeague(league) {
    		return Object.keys(league.users).some(k => k === $loggedInUser?.id);
    	}

    	const writable_props = ['leagues'];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LeagueTable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('leagues' in $$props) $$invalidate(0, leagues = $$props.leagues);
    	};

    	$$self.$capture_state = () => ({
    		Navigate: src_7,
    		loggedInUser,
    		leagues,
    		isLoggedInUserInLeague,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('leagues' in $$props) $$invalidate(0, leagues = $$props.leagues);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [leagues, isLoggedInUserInLeague];
    }

    class LeagueTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { leagues: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LeagueTable",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get leagues() {
    		throw new Error("<LeagueTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leagues(value) {
    		throw new Error("<LeagueTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Leagues\Leagues.svelte generated by Svelte v3.49.0 */
    const file$f = "src\\Leagues\\Leagues.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (46:6) {#each seasons as s}
    function create_each_block$6(ctx) {
    	let option;
    	let t_value = /*s*/ ctx[11] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*s*/ ctx[11];
    			option.value = option.__value;
    			add_location(option, file$f, 46, 8, 1285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(46:6) {#each seasons as s}",
    		ctx
    	});

    	return block;
    }

    // (53:2) {:else}
    function create_else_block$9(ctx) {
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*leaguesForSeason*/ ctx[0] && /*leaguesForSeason*/ ctx[0].length > 0 && create_if_block_2$4(ctx);
    	const if_block_creators = [create_if_block_1$9, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*createToggled*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*leaguesForSeason*/ ctx[0] && /*leaguesForSeason*/ ctx[0].length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*leaguesForSeason*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(53:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:2) {#if loading}
    function create_if_block$c(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(51:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if leaguesForSeason && leaguesForSeason.length > 0}
    function create_if_block_2$4(ctx) {
    	let div;
    	let leaguetable;
    	let current;

    	leaguetable = new LeagueTable({
    			props: { leagues: /*leaguesForSeason*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(leaguetable.$$.fragment);
    			attr_dev(div, "class", "leagues svelte-uy5srf");
    			add_location(div, file$f, 54, 6, 1476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(leaguetable, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const leaguetable_changes = {};
    			if (dirty & /*leaguesForSeason*/ 1) leaguetable_changes.leagues = /*leaguesForSeason*/ ctx[0];
    			leaguetable.$set(leaguetable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leaguetable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leaguetable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(leaguetable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(54:4) {#if leaguesForSeason && leaguesForSeason.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (61:4) {:else}
    function create_else_block_1$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Create League";
    			attr_dev(button, "class", "svelte-uy5srf");
    			add_location(button, file$f, 60, 11, 1728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleCreate*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(61:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#if createToggled}
    function create_if_block_1$9(ctx) {
    	let createleagues;
    	let current;
    	createleagues = new CreateLeagues({ $$inline: true });
    	createleagues.$on("create-league-cancelled", /*toggleCreate*/ ctx[5]);
    	createleagues.$on("create-league-succeeded", /*handleLeagueCreated*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(createleagues.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(createleagues, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(createleagues.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(createleagues.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(createleagues, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(59:4) {#if createToggled}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let select;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*seasons*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const if_block_creators = [create_if_block$c, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Leagues";
    			t1 = space();
    			div0 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if_block.c();
    			attr_dev(h1, "class", "svelte-uy5srf");
    			add_location(h1, file$f, 42, 2, 1140);
    			if (/*season*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[8].call(select));
    			add_location(select, file$f, 44, 4, 1193);
    			attr_dev(div0, "class", "select-season svelte-uy5srf");
    			add_location(div0, file$f, 43, 2, 1160);
    			attr_dev(div1, "class", "container svelte-uy5srf");
    			add_location(div1, file$f, 41, 0, 1113);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*season*/ ctx[3]);
    			append_dev(div1, t2);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[8]),
    					listen_dev(select, "change", /*filterLeagues*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*seasons*/ 16) {
    				each_value = /*seasons*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*season, seasons*/ 24) {
    				select_option(select, /*season*/ ctx[3]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(10, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Leagues', slots, []);
    	let leagues = [];
    	let leaguesForSeason = [];
    	let createToggled = false;
    	let loading = false;
    	let season = getCurrentSeason();
    	let seasons = getSeasons();

    	function toggleCreate() {
    		$$invalidate(1, createToggled = !createToggled);
    	}

    	function handleLeagueCreated(evt) {
    		leagues = [...leagues, evt.detail.createdLeague];
    		filterLeagues();
    	}

    	function filterLeagues() {
    		$$invalidate(0, leaguesForSeason = leagues.filter(l => l.season === season));
    	}

    	onMount(async () => {
    		try {
    			$$invalidate(2, loading = true);
    			leagues = await fetchLeagues($loggedInUser);
    			$$invalidate(0, leaguesForSeason = leagues.filter(l => l.season === season));
    			$$invalidate(2, loading = false);
    		} catch(err) {
    			$$invalidate(2, loading = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Leagues> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		season = select_value(this);
    		$$invalidate(3, season);
    		$$invalidate(4, seasons);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		CreateLeagues,
    		loggedInUser,
    		fetchLeagues,
    		getCurrentSeason,
    		getSeasons,
    		LeagueTable,
    		LoadingIndicator,
    		leagues,
    		leaguesForSeason,
    		createToggled,
    		loading,
    		season,
    		seasons,
    		toggleCreate,
    		handleLeagueCreated,
    		filterLeagues,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('leagues' in $$props) leagues = $$props.leagues;
    		if ('leaguesForSeason' in $$props) $$invalidate(0, leaguesForSeason = $$props.leaguesForSeason);
    		if ('createToggled' in $$props) $$invalidate(1, createToggled = $$props.createToggled);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    		if ('season' in $$props) $$invalidate(3, season = $$props.season);
    		if ('seasons' in $$props) $$invalidate(4, seasons = $$props.seasons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		leaguesForSeason,
    		createToggled,
    		loading,
    		season,
    		seasons,
    		toggleCreate,
    		handleLeagueCreated,
    		filterLeagues,
    		select_change_handler
    	];
    }

    class Leagues extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Leagues",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\SelectSeason.svelte generated by Svelte v3.49.0 */
    const file$e = "src\\SelectSeason.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (62:2) {#if !loading}
    function create_if_block$b(ctx) {
    	let select0;
    	let t;
    	let select1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*seasons*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*weeks*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			select1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (/*season*/ ctx[0] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[6].call(select0));
    			add_location(select0, file$e, 63, 4, 2193);
    			if (/*week*/ ctx[1] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[7].call(select1));
    			add_location(select1, file$e, 69, 4, 2396);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*season*/ ctx[0]);
    			insert_dev(target, t, anchor);
    			insert_dev(target, select1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*week*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[6]),
    					listen_dev(select0, "change", /*dispatchEvent*/ ctx[5], false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[7]),
    					listen_dev(select1, "change", /*dispatchEvent*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*seasons*/ 8) {
    				each_value_1 = /*seasons*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*season, seasons*/ 9) {
    				select_option(select0, /*season*/ ctx[0]);
    			}

    			if (dirty & /*weeks*/ 16) {
    				each_value = /*weeks*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*week, weeks*/ 18) {
    				select_option(select1, /*week*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(select1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(62:2) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (65:6) {#each seasons as s}
    function create_each_block_1$3(ctx) {
    	let option;
    	let t_value = /*s*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*s*/ ctx[13];
    			option.value = option.__value;
    			add_location(option, file$e, 65, 8, 2285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(65:6) {#each seasons as s}",
    		ctx
    	});

    	return block;
    }

    // (71:6) {#each weeks as w}
    function create_each_block$5(ctx) {
    	let option;
    	let t_value = /*w*/ ctx[10].displayName + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*w*/ ctx[10];
    			option.value = option.__value;
    			add_location(option, file$e, 71, 8, 2484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(71:6) {#each weeks as w}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let if_block = !/*loading*/ ctx[2] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			add_location(main, file$e, 60, 0, 2118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*loading*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function populateWeeks() {
    	let weeksArray = [];

    	for (let i = 1; i <= 4; i++) {
    		weeksArray.push({
    			week: i,
    			seasonType: "Pre",
    			displayName: `Preseason Week ${i}`
    		});
    	}

    	for (let i = 1; i <= 18; i++) {
    		weeksArray.push({
    			week: i,
    			seasonType: "Reg",
    			displayName: `Week ${i}`
    		});
    	}

    	weeksArray.push({
    		week: 1,
    		seasonType: "Post",
    		displayName: "Wild Card"
    	});

    	weeksArray.push({
    		week: 2,
    		seasonType: "Post",
    		displayName: "Divisional Round"
    	});

    	weeksArray.push({
    		week: 3,
    		seasonType: "Post",
    		displayName: "Conference Championships"
    	});

    	weeksArray.push({
    		week: 4,
    		seasonType: "Post",
    		displayName: "Pro Bowl"
    	});

    	weeksArray.push({
    		week: 5,
    		seasonType: "Post",
    		displayName: "Super Bowl"
    	});

    	return weeksArray;
    }

    function sortGames(games) {
    	return games.sort((a, b) => {
    		if (a.startTime > b.startTime) return 1;
    		if (a.startTime < b.startTime) return -1;
    		if (a.startTime == b.startTime) return 0;
    	});
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectSeason', slots, []);
    	const dispatch = createEventDispatcher();
    	let games = [];
    	let season = getCurrentSeason();
    	const seasons = getSeasons();
    	let weeks = populateWeeks();
    	let week = {};
    	let loading = false;

    	onMount(async () => {
    		$$invalidate(2, loading = true);
    		dispatch("season-select-started");
    		games = await fetchGamesForCurrentWeek();
    		games = sortGames(games);

    		if (games && games.length > 0) {
    			$$invalidate(0, season = games[0].season);
    			$$invalidate(1, week = weeks.find(w => w.week === games[0].week && w.seasonType === games[0].seasonType));
    		}

    		dispatch("season-select-finished", { games });
    		$$invalidate(2, loading = false);
    	});

    	async function dispatchEvent() {
    		$$invalidate(2, loading = true);
    		dispatch("season-select-started");
    		games = await fetchGames(season, week.seasonType, week.week);
    		games = sortGames(games);
    		dispatch("season-select-finished", { games });
    		$$invalidate(2, loading = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectSeason> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		season = select_value(this);
    		$$invalidate(0, season);
    		$$invalidate(3, seasons);
    	}

    	function select1_change_handler() {
    		week = select_value(this);
    		$$invalidate(1, week);
    		$$invalidate(4, weeks);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		fetchGames,
    		fetchGamesForCurrentWeek,
    		getCurrentSeason,
    		getSeasons,
    		dispatch,
    		games,
    		season,
    		seasons,
    		weeks,
    		week,
    		loading,
    		populateWeeks,
    		dispatchEvent,
    		sortGames
    	});

    	$$self.$inject_state = $$props => {
    		if ('games' in $$props) games = $$props.games;
    		if ('season' in $$props) $$invalidate(0, season = $$props.season);
    		if ('weeks' in $$props) $$invalidate(4, weeks = $$props.weeks);
    		if ('week' in $$props) $$invalidate(1, week = $$props.week);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		season,
    		week,
    		loading,
    		seasons,
    		weeks,
    		dispatchEvent,
    		select0_change_handler,
    		select1_change_handler
    	];
    }

    class SelectSeason extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectSeason",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\Leagues\DisplayBets.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$2 } = globals;
    const file$d = "src\\Leagues\\DisplayBets.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (146:2) {:else}
    function create_else_block$8(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "No games yet";
    			add_location(h3, file$d, 146, 4, 4814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(146:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (103:29) 
    function create_if_block_1$8(ctx) {
    	let show_if = nbrOfUsers(/*allUsers*/ ctx[2]) >= 5;
    	let t0;
    	let table;
    	let tr0;
    	let th0;
    	let t2;
    	let th1;
    	let t3_value = /*$loggedInUser*/ ctx[5]?.username + "";
    	let t3;
    	let t4;
    	let t5;
    	let tr1;
    	let td0;
    	let t7;
    	let td1;
    	let t8_value = /*getPointsText*/ ctx[9](/*league*/ ctx[0].bets[/*$loggedInUser*/ ctx[5]?.id]) + "";
    	let t8;
    	let br;
    	let t9_value = /*getRecord*/ ctx[10](/*league*/ ctx[0].bets[/*$loggedInUser*/ ctx[5]?.id]) + "";
    	let t9;
    	let t10;
    	let t11;
    	let if_block = show_if && create_if_block_2$3(ctx);
    	let each_value_3 = Object.values(/*selectedUsers*/ ctx[3]);
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = Object.values(/*selectedUsers*/ ctx[3]);
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value = /*games*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Game";
    			t2 = space();
    			th1 = element("th");
    			t3 = text(t3_value);
    			t4 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t5 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Points";
    			t7 = space();
    			td1 = element("td");
    			t8 = text(t8_value);
    			br = element("br");
    			t9 = text(t9_value);
    			t10 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "game-heading svelte-re9cm6");
    			add_location(th0, file$d, 108, 8, 3283);
    			attr_dev(th1, "class", "my-cell svelte-re9cm6");
    			add_location(th1, file$d, 109, 8, 3327);
    			attr_dev(tr0, "class", "svelte-re9cm6");
    			add_location(tr0, file$d, 107, 6, 3269);
    			attr_dev(td0, "class", "svelte-re9cm6");
    			add_location(td0, file$d, 115, 8, 3519);
    			add_location(br, file$d, 116, 59, 3595);
    			attr_dev(td1, "class", "svelte-re9cm6");
    			add_location(td1, file$d, 116, 8, 3544);
    			attr_dev(tr1, "class", "svelte-re9cm6");
    			add_location(tr1, file$d, 114, 6, 3505);
    			attr_dev(table, "class", "svelte-re9cm6");
    			add_location(table, file$d, 106, 4, 3254);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t2);
    			append_dev(tr0, th1);
    			append_dev(th1, t3);
    			append_dev(tr0, t4);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(tr0, null);
    			}

    			append_dev(table, t5);
    			append_dev(table, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t7);
    			append_dev(tr1, td1);
    			append_dev(td1, t8);
    			append_dev(td1, br);
    			append_dev(td1, t9);
    			append_dev(tr1, t10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr1, null);
    			}

    			append_dev(table, t11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*allUsers*/ 4) show_if = nbrOfUsers(/*allUsers*/ ctx[2]) >= 5;

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$loggedInUser*/ 32 && t3_value !== (t3_value = /*$loggedInUser*/ ctx[5]?.username + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*Object, selectedUsers*/ 8) {
    				each_value_3 = Object.values(/*selectedUsers*/ ctx[3]);
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(tr0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty & /*league, $loggedInUser*/ 33 && t8_value !== (t8_value = /*getPointsText*/ ctx[9](/*league*/ ctx[0].bets[/*$loggedInUser*/ ctx[5]?.id]) + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*league, $loggedInUser*/ 33 && t9_value !== (t9_value = /*getRecord*/ ctx[10](/*league*/ ctx[0].bets[/*$loggedInUser*/ ctx[5]?.id]) + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*getRecord, league, Object, selectedUsers, getPointsText*/ 1545) {
    				each_value_2 = Object.values(/*selectedUsers*/ ctx[3]);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*Object, selectedUsers, getCellClass, games, league, getBetByUser, $loggedInUser*/ 57) {
    				each_value = /*games*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(103:29) ",
    		ctx
    	});

    	return block;
    }

    // (101:2) {#if loading}
    function create_if_block$a(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(101:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#if nbrOfUsers(allUsers) >= 5}
    function create_if_block_2$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Switch users";
    			attr_dev(button, "class", "svelte-re9cm6");
    			add_location(button, file$d, 104, 6, 3187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*nextBatch*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(104:4) {#if nbrOfUsers(allUsers) >= 5}",
    		ctx
    	});

    	return block;
    }

    // (111:8) {#each Object.values(selectedUsers) as user}
    function create_each_block_3(ctx) {
    	let th;
    	let t_value = /*user*/ ctx[16].username + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-re9cm6");
    			add_location(th, file$d, 111, 10, 3443);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedUsers*/ 8 && t_value !== (t_value = /*user*/ ctx[16].username + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(111:8) {#each Object.values(selectedUsers) as user}",
    		ctx
    	});

    	return block;
    }

    // (118:8) {#each Object.values(selectedUsers) as user}
    function create_each_block_2$1(ctx) {
    	let td;
    	let t0_value = /*getPointsText*/ ctx[9](/*league*/ ctx[0].bets[/*user*/ ctx[16].id]) + "";
    	let t0;
    	let br;
    	let t1_value = /*getRecord*/ ctx[10](/*league*/ ctx[0].bets[/*user*/ ctx[16].id]) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t0 = text(t0_value);
    			br = element("br");
    			t1 = text(t1_value);
    			add_location(br, file$d, 118, 51, 3756);
    			attr_dev(td, "class", "svelte-re9cm6");
    			add_location(td, file$d, 118, 10, 3715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t0);
    			append_dev(td, br);
    			append_dev(td, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*league, selectedUsers*/ 9 && t0_value !== (t0_value = /*getPointsText*/ ctx[9](/*league*/ ctx[0].bets[/*user*/ ctx[16].id]) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*league, selectedUsers*/ 9 && t1_value !== (t1_value = /*getRecord*/ ctx[10](/*league*/ ctx[0].bets[/*user*/ ctx[16].id]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(118:8) {#each Object.values(selectedUsers) as user}",
    		ctx
    	});

    	return block;
    }

    // (135:10) {#each Object.values(selectedUsers) as user}
    function create_each_block_1$2(ctx) {
    	let td;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let td_class_value;

    	const block = {
    		c: function create() {
    			td = element("td");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = getBetByUser(/*game*/ ctx[13].id, /*user*/ ctx[16].id, /*league*/ ctx[0])?.winningTeam?.logo ?? "/assets/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = getBetByUser(/*game*/ ctx[13].id, /*user*/ ctx[16].id, /*league*/ ctx[0])?.winningTeam?.name ?? "No bet");
    			attr_dev(img, "class", "svelte-re9cm6");
    			add_location(img, file$d, 136, 14, 4497);
    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(getCellClass(/*game*/ ctx[13].id, /*user*/ ctx[16].id, /*league*/ ctx[0])) + " svelte-re9cm6"));
    			add_location(td, file$d, 135, 12, 4430);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*games, selectedUsers, league*/ 25 && !src_url_equal(img.src, img_src_value = getBetByUser(/*game*/ ctx[13].id, /*user*/ ctx[16].id, /*league*/ ctx[0])?.winningTeam?.logo ?? "/assets/logo.png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*games, selectedUsers, league*/ 25 && img_alt_value !== (img_alt_value = getBetByUser(/*game*/ ctx[13].id, /*user*/ ctx[16].id, /*league*/ ctx[0])?.winningTeam?.name ?? "No bet")) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*games, selectedUsers, league*/ 25 && td_class_value !== (td_class_value = "" + (null_to_empty(getCellClass(/*game*/ ctx[13].id, /*user*/ ctx[16].id, /*league*/ ctx[0])) + " svelte-re9cm6"))) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(135:10) {#each Object.values(selectedUsers) as user}",
    		ctx
    	});

    	return block;
    }

    // (122:6) {#each games as game}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*game*/ ctx[13].awayTeam.abbreviation + "";
    	let t0;
    	let t1;
    	let b;
    	let t3;
    	let t4_value = /*game*/ ctx[13].homeTeam.abbreviation + "";
    	let t4;
    	let t5;
    	let td1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let td1_class_value;
    	let t6;
    	let t7;
    	let each_value_1 = Object.values(/*selectedUsers*/ ctx[3]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			b = element("b");
    			b.textContent = "@";
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			td1 = element("td");
    			img = element("img");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			add_location(b, file$d, 125, 12, 3957);
    			attr_dev(td0, "class", "asd svelte-re9cm6");
    			add_location(td0, file$d, 123, 10, 3885);
    			if (!src_url_equal(img.src, img_src_value = getBetByUser(/*game*/ ctx[13].id, /*$loggedInUser*/ ctx[5]?.id, /*league*/ ctx[0])?.winningTeam?.logo ?? "/assets/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = getBetByUser(/*game*/ ctx[13].id, /*$loggedInUser*/ ctx[5]?.id, /*league*/ ctx[0])?.winningTeam?.name ?? "No bet");
    			attr_dev(img, "class", "svelte-re9cm6");
    			add_location(img, file$d, 129, 12, 4111);
    			attr_dev(td1, "class", td1_class_value = "" + (null_to_empty(getCellClass(/*game*/ ctx[13].id, /*$loggedInUser*/ ctx[5]?.id, /*league*/ ctx[0])) + " svelte-re9cm6"));
    			add_location(td1, file$d, 128, 10, 4036);
    			attr_dev(tr, "class", "svelte-re9cm6");
    			add_location(tr, file$d, 122, 8, 3869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(td0, b);
    			append_dev(td0, t3);
    			append_dev(td0, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td1);
    			append_dev(td1, img);
    			append_dev(tr, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*games*/ 16 && t0_value !== (t0_value = /*game*/ ctx[13].awayTeam.abbreviation + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*games*/ 16 && t4_value !== (t4_value = /*game*/ ctx[13].homeTeam.abbreviation + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*games, $loggedInUser, league*/ 49 && !src_url_equal(img.src, img_src_value = getBetByUser(/*game*/ ctx[13].id, /*$loggedInUser*/ ctx[5]?.id, /*league*/ ctx[0])?.winningTeam?.logo ?? "/assets/logo.png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*games, $loggedInUser, league*/ 49 && img_alt_value !== (img_alt_value = getBetByUser(/*game*/ ctx[13].id, /*$loggedInUser*/ ctx[5]?.id, /*league*/ ctx[0])?.winningTeam?.name ?? "No bet")) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*games, $loggedInUser, league*/ 49 && td1_class_value !== (td1_class_value = "" + (null_to_empty(getCellClass(/*game*/ ctx[13].id, /*$loggedInUser*/ ctx[5]?.id, /*league*/ ctx[0])) + " svelte-re9cm6"))) {
    				attr_dev(td1, "class", td1_class_value);
    			}

    			if (dirty & /*getCellClass, games, Object, selectedUsers, league, getBetByUser*/ 25) {
    				each_value_1 = Object.values(/*selectedUsers*/ ctx[3]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t7);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(122:6) {#each games as game}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let selectseason;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	selectseason = new SelectSeason({ $$inline: true });
    	selectseason.$on("season-select-started", /*handleSeasonSelectStarted*/ ctx[7]);
    	selectseason.$on("season-select-finished", /*handleSeasonSelectFinished*/ ctx[6]);
    	const if_block_creators = [create_if_block$a, create_if_block_1$8, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		if (/*games*/ ctx[4].length > 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "View bets";
    			t1 = space();
    			create_component(selectseason.$$.fragment);
    			t2 = space();
    			if_block.c();
    			add_location(h2, file$d, 98, 2, 2922);
    			attr_dev(div, "class", "container svelte-re9cm6");
    			add_location(div, file$d, 97, 0, 2895);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			mount_component(selectseason, div, null);
    			append_dev(div, t2);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectseason.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectseason.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(selectseason);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getBetByUser(gameId, userId, league) {
    	const userBets = league.bets[userId];

    	if (!userBets) {
    		return {};
    	}

    	return userBets?.find(b => b.game.id === gameId);
    }

    function getCellClass(gameId, userId, league) {
    	const bet = getBetByUser(gameId, userId, league);

    	if (!bet?.finished) {
    		return "";
    	}

    	return bet.successful ? "success" : "failure";
    }

    function nbrOfUsers(users) {
    	return Object.keys(users).length;
    }

    function pointsForUser(userBets, week, seasonType) {
    	return userBets.filter(b => b.game.week === week && b.game.seasonType === seasonType).reduce((x, y) => x + y.points, 0);
    }

    function nbrOfSuccessfulBets$1(bets, week, seasonType) {
    	return bets.filter(b => b.game.week === week && b.game.seasonType === seasonType && b.successful).length;
    }

    function nbrOfFinishedBets$1(bets, week, seasonType) {
    	return bets.filter(b => b.game.week === week && b.game.seasonType === seasonType && b.finished).length;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(5, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DisplayBets', slots, []);
    	let { league } = $$props;
    	let sliceStartIndex = 0;
    	let sliceEndIndex = 4;
    	let loading = false;
    	let allUsers = [];
    	let selectedUsers = [];
    	let games = [];

    	onMount(async () => {
    		$$invalidate(2, allUsers = league.users);
    		$$invalidate(3, selectedUsers = Object.values(allUsers).filter(u => u.id !== $loggedInUser?.id).slice(sliceStartIndex, sliceEndIndex));
    	});

    	function handleSeasonSelectFinished(evt) {
    		$$invalidate(4, games = evt.detail.games);
    		$$invalidate(1, loading = false);
    	}

    	function handleSeasonSelectStarted() {
    		$$invalidate(1, loading = true);
    	}

    	function nextBatch() {
    		if (sliceEndIndex === nbrOfUsers(allUsers) + 1) {
    			sliceStartIndex = 0;
    			sliceEndIndex = 4;
    		} else {
    			sliceStartIndex = Math.min(sliceEndIndex, nbrOfUsers(allUsers) - 5);
    			sliceEndIndex = Math.min(sliceEndIndex + 4, nbrOfUsers(allUsers) + 1);
    		}

    		$$invalidate(3, selectedUsers = Object.values(allUsers).filter(u => u.id !== $loggedInUser?.id).slice(sliceStartIndex, sliceEndIndex));
    	}

    	function getPointsText(existingBets) {
    		if (!existingBets) {
    			return "";
    		}

    		const week = games[0].week;
    		const seasonType = games[0].seasonType;
    		return `${pointsForUser(existingBets, week, seasonType).toFixed(2)}`;
    	}

    	function getRecord(existingBets) {
    		if (!existingBets) {
    			return "";
    		}

    		const week = games[0].week;
    		const seasonType = games[0].seasonType;
    		return `(${nbrOfSuccessfulBets$1(existingBets, week, seasonType)}-${nbrOfFinishedBets$1(existingBets, week, seasonType) - nbrOfSuccessfulBets$1(existingBets, week, seasonType)})`;
    	}

    	const writable_props = ['league'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DisplayBets> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('league' in $$props) $$invalidate(0, league = $$props.league);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		LoadingIndicator,
    		loggedInUser,
    		SelectSeason,
    		league,
    		sliceStartIndex,
    		sliceEndIndex,
    		loading,
    		allUsers,
    		selectedUsers,
    		games,
    		handleSeasonSelectFinished,
    		handleSeasonSelectStarted,
    		getBetByUser,
    		getCellClass,
    		nextBatch,
    		nbrOfUsers,
    		pointsForUser,
    		nbrOfSuccessfulBets: nbrOfSuccessfulBets$1,
    		nbrOfFinishedBets: nbrOfFinishedBets$1,
    		getPointsText,
    		getRecord,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('league' in $$props) $$invalidate(0, league = $$props.league);
    		if ('sliceStartIndex' in $$props) sliceStartIndex = $$props.sliceStartIndex;
    		if ('sliceEndIndex' in $$props) sliceEndIndex = $$props.sliceEndIndex;
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('allUsers' in $$props) $$invalidate(2, allUsers = $$props.allUsers);
    		if ('selectedUsers' in $$props) $$invalidate(3, selectedUsers = $$props.selectedUsers);
    		if ('games' in $$props) $$invalidate(4, games = $$props.games);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		league,
    		loading,
    		allUsers,
    		selectedUsers,
    		games,
    		$loggedInUser,
    		handleSeasonSelectFinished,
    		handleSeasonSelectStarted,
    		nextBatch,
    		getPointsText,
    		getRecord
    	];
    }

    class DisplayBets extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { league: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DisplayBets",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*league*/ ctx[0] === undefined && !('league' in props)) {
    			console.warn("<DisplayBets> was created without expected prop 'league'");
    		}
    	}

    	get league() {
    		throw new Error("<DisplayBets>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set league(value) {
    		throw new Error("<DisplayBets>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Leagues\DeleteLeague.svelte generated by Svelte v3.49.0 */
    const file$c = "src\\Leagues\\DeleteLeague.svelte";

    // (34:0) {:else}
    function create_else_block$7(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete league";
    			attr_dev(button, "class", "svelte-1kydb28");
    			add_location(button, file$c, 34, 2, 911);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*delLeague*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(34:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#if loading}
    function create_if_block$9(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(32:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(3, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeleteLeague', slots, []);
    	let { league } = $$props;
    	let loading = false;
    	const dispatch = createEventDispatcher();

    	async function delLeague() {
    		try {
    			$$invalidate(0, loading = true);
    			await deleteLeague($loggedInUser, league.id);
    			$$invalidate(0, loading = false);
    			toast.push("League deleted");
    			src_3("/leagues");
    		} catch(error) {
    			$$invalidate(0, loading = false);

    			toast.push("An error occured", {
    				theme: {
    					"--toastBackground": "#f54260",
    					"--toastProgressBackground": "white"
    				}
    			});
    		}
    	}

    	const writable_props = ['league'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeleteLeague> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('league' in $$props) $$invalidate(2, league = $$props.league);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		toast,
    		deleteLeague,
    		loggedInUser,
    		LoadingIndicator,
    		navigateTo: src_3,
    		league,
    		loading,
    		dispatch,
    		delLeague,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('league' in $$props) $$invalidate(2, league = $$props.league);
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading, delLeague, league];
    }

    class DeleteLeague extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { league: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeleteLeague",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*league*/ ctx[2] === undefined && !('league' in props)) {
    			console.warn("<DeleteLeague> was created without expected prop 'league'");
    		}
    	}

    	get league() {
    		throw new Error("<DeleteLeague>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set league(value) {
    		throw new Error("<DeleteLeague>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Leagues\JoinLeague.svelte generated by Svelte v3.49.0 */
    const file$b = "src\\Leagues\\JoinLeague.svelte";

    // (23:0) {:else}
    function create_else_block$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Join League";
    			attr_dev(button, "class", "svelte-1kydb28");
    			add_location(button, file$b, 23, 2, 652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*join*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(23:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if loading}
    function create_if_block$8(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(21:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(3, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('JoinLeague', slots, []);
    	let { league } = $$props;
    	let loading = false;
    	const dispatch = createEventDispatcher();

    	async function join() {
    		$$invalidate(0, loading = true);
    		const joinedLeague = await joinLeague($loggedInUser, league.id);
    		dispatch("join-league-succeeded", { joinedLeague });
    		$$invalidate(0, loading = false);
    		toast.push("League joined");
    	}

    	const writable_props = ['league'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<JoinLeague> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('league' in $$props) $$invalidate(2, league = $$props.league);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		toast,
    		joinLeague,
    		loggedInUser,
    		LoadingIndicator,
    		league,
    		loading,
    		dispatch,
    		join,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('league' in $$props) $$invalidate(2, league = $$props.league);
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading, join, league];
    }

    class JoinLeague extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { league: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JoinLeague",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*league*/ ctx[2] === undefined && !('league' in props)) {
    			console.warn("<JoinLeague> was created without expected prop 'league'");
    		}
    	}

    	get league() {
    		throw new Error("<JoinLeague>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set league(value) {
    		throw new Error("<JoinLeague>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Leagues\Leaderboard.svelte generated by Svelte v3.49.0 */
    const file$a = "src\\Leagues\\Leaderboard.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (15:2) {#each leaderboard as leaderBoardEntry, index}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*index*/ ctx[5] + 1 + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*leaderBoardEntry*/ ctx[3].user.username + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*leaderBoardEntry*/ ctx[3].numberOfCorrectBets + "";
    	let t4;
    	let t5;
    	let t6_value = /*leaderBoardEntry*/ ctx[3].numberOfIncorrectBets + "";
    	let t6;
    	let t7;
    	let td3;
    	let t8_value = /*leaderBoardEntry*/ ctx[3].points.toFixed(2) + "";
    	let t8;
    	let t9;
    	let tr_class_value;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = text("-");
    			t6 = text(t6_value);
    			t7 = space();
    			td3 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			attr_dev(td0, "class", "svelte-1uy11d1");
    			add_location(td0, file$a, 16, 6, 406);
    			attr_dev(td1, "class", "svelte-1uy11d1");
    			add_location(td1, file$a, 17, 6, 434);
    			attr_dev(td2, "class", "svelte-1uy11d1");
    			add_location(td2, file$a, 18, 6, 483);
    			attr_dev(td3, "class", "svelte-1uy11d1");
    			add_location(td3, file$a, 19, 6, 579);

    			attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(/*leaderBoardEntry*/ ctx[3].user.id === /*$loggedInUser*/ ctx[2]?.id
    			? "my-row"
    			: "") + " svelte-1uy11d1"));

    			add_location(tr, file$a, 15, 4, 323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(td2, t5);
    			append_dev(td2, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			append_dev(td3, t8);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*leaderboard*/ 1 && t2_value !== (t2_value = /*leaderBoardEntry*/ ctx[3].user.username + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*leaderboard*/ 1 && t4_value !== (t4_value = /*leaderBoardEntry*/ ctx[3].numberOfCorrectBets + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*leaderboard*/ 1 && t6_value !== (t6_value = /*leaderBoardEntry*/ ctx[3].numberOfIncorrectBets + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*leaderboard*/ 1 && t8_value !== (t8_value = /*leaderBoardEntry*/ ctx[3].points.toFixed(2) + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*leaderboard, $loggedInUser*/ 5 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*leaderBoardEntry*/ ctx[3].user.id === /*$loggedInUser*/ ctx[2]?.id
    			? "my-row"
    			: "") + " svelte-1uy11d1"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(15:2) {#each leaderboard as leaderBoardEntry, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let table;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let each_value = /*leaderboard*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(/*leaderboardHeader*/ ctx[1]);
    			t1 = space();
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "#";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "User";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Record";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Points";
    			t9 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$a, 6, 0, 136);
    			attr_dev(th0, "class", "svelte-1uy11d1");
    			add_location(th0, file$a, 9, 4, 187);
    			attr_dev(th1, "class", "svelte-1uy11d1");
    			add_location(th1, file$a, 10, 4, 203);
    			attr_dev(th2, "class", "svelte-1uy11d1");
    			add_location(th2, file$a, 11, 4, 222);
    			attr_dev(th3, "class", "svelte-1uy11d1");
    			add_location(th3, file$a, 12, 4, 243);
    			attr_dev(tr, "class", "svelte-1uy11d1");
    			add_location(tr, file$a, 8, 2, 177);
    			attr_dev(table, "class", "svelte-1uy11d1");
    			add_location(table, file$a, 7, 0, 166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(table, t9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*leaderboardHeader*/ 2) set_data_dev(t0, /*leaderboardHeader*/ ctx[1]);

    			if (dirty & /*leaderboard, $loggedInUser*/ 5) {
    				each_value = /*leaderboard*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(2, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Leaderboard', slots, []);
    	let { leaderboard = [] } = $$props;
    	let { leaderboardHeader = "" } = $$props;
    	const writable_props = ['leaderboard', 'leaderboardHeader'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Leaderboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('leaderboard' in $$props) $$invalidate(0, leaderboard = $$props.leaderboard);
    		if ('leaderboardHeader' in $$props) $$invalidate(1, leaderboardHeader = $$props.leaderboardHeader);
    	};

    	$$self.$capture_state = () => ({
    		loggedInUser,
    		leaderboard,
    		leaderboardHeader,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('leaderboard' in $$props) $$invalidate(0, leaderboard = $$props.leaderboard);
    		if ('leaderboardHeader' in $$props) $$invalidate(1, leaderboardHeader = $$props.leaderboardHeader);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [leaderboard, leaderboardHeader, $loggedInUser];
    }

    class Leaderboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { leaderboard: 0, leaderboardHeader: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Leaderboard",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get leaderboard() {
    		throw new Error("<Leaderboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leaderboard(value) {
    		throw new Error("<Leaderboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get leaderboardHeader() {
    		throw new Error("<Leaderboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leaderboardHeader(value) {
    		throw new Error("<Leaderboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Leagues\League.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$9 = "src\\Leagues\\League.svelte";

    // (58:2) {:else}
    function create_else_block$5(ctx) {
    	let t0;
    	let show_if_1 = /*league*/ ctx[0].bets && /*isLoggedInUserInLeague*/ ctx[5]();
    	let t1;
    	let show_if = /*isLoggedInUserAdmin*/ ctx[6]();
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*users*/ ctx[1] && /*league*/ ctx[0] && create_if_block_3$1(ctx);
    	let if_block1 = show_if_1 && create_if_block_2$2(ctx);
    	let if_block2 = show_if && create_if_block_1$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*users*/ ctx[1] && /*league*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*users, league*/ 3) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*league*/ 1) show_if_1 = /*league*/ ctx[0].bets && /*isLoggedInUserInLeague*/ ctx[5]();

    			if (show_if_1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*league*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (show_if) if_block2.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(58:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:2) {#if loading}
    function create_if_block$7(ctx) {
    	let div;
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loadingindicator.$$.fragment);
    			attr_dev(div, "class", "loading-indicator svelte-14p1h6l");
    			add_location(div, file$9, 54, 4, 1726);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loadingindicator, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loadingindicator);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(54:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#if users && league}
    function create_if_block_3$1(ctx) {
    	let h1;
    	let t0_value = /*league*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let show_if = !/*isLoggedInUserInLeague*/ ctx[5]();
    	let t2;
    	let leaderboard0;
    	let t3;
    	let leaderboard1;
    	let current;
    	let if_block = show_if && create_if_block_4$1(ctx);

    	leaderboard0 = new Leaderboard({
    			props: {
    				leaderboard: /*regularSeasonLeaderboard*/ ctx[2],
    				leaderboardHeader: "Regular season standings"
    			},
    			$$inline: true
    		});

    	leaderboard1 = new Leaderboard({
    			props: {
    				leaderboard: /*postSeasonLeaderboard*/ ctx[3],
    				leaderboardHeader: "Post season standings"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(leaderboard0.$$.fragment);
    			t3 = space();
    			create_component(leaderboard1.$$.fragment);
    			add_location(h1, file$9, 59, 6, 1843);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(leaderboard0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(leaderboard1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*league*/ 1) && t0_value !== (t0_value = /*league*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (show_if) if_block.p(ctx, dirty);
    			const leaderboard0_changes = {};
    			if (dirty & /*regularSeasonLeaderboard*/ 4) leaderboard0_changes.leaderboard = /*regularSeasonLeaderboard*/ ctx[2];
    			leaderboard0.$set(leaderboard0_changes);
    			const leaderboard1_changes = {};
    			if (dirty & /*postSeasonLeaderboard*/ 8) leaderboard1_changes.leaderboard = /*postSeasonLeaderboard*/ ctx[3];
    			leaderboard1.$set(leaderboard1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(leaderboard0.$$.fragment, local);
    			transition_in(leaderboard1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(leaderboard0.$$.fragment, local);
    			transition_out(leaderboard1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(leaderboard0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(leaderboard1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(59:4) {#if users && league}",
    		ctx
    	});

    	return block;
    }

    // (61:6) {#if !isLoggedInUserInLeague()}
    function create_if_block_4$1(ctx) {
    	let joinleague;
    	let current;

    	joinleague = new JoinLeague({
    			props: { league: /*league*/ ctx[0] },
    			$$inline: true
    		});

    	joinleague.$on("join-league-succeeded", /*handleJoinLeagueSuccess*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(joinleague.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(joinleague, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const joinleague_changes = {};
    			if (dirty & /*league*/ 1) joinleague_changes.league = /*league*/ ctx[0];
    			joinleague.$set(joinleague_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(joinleague.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(joinleague.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(joinleague, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(61:6) {#if !isLoggedInUserInLeague()}",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#if league.bets && isLoggedInUserInLeague()}
    function create_if_block_2$2(ctx) {
    	let displaybets;
    	let current;

    	displaybets = new DisplayBets({
    			props: { league: /*league*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(displaybets.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(displaybets, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const displaybets_changes = {};
    			if (dirty & /*league*/ 1) displaybets_changes.league = /*league*/ ctx[0];
    			displaybets.$set(displaybets_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(displaybets.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(displaybets.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(displaybets, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(67:4) {#if league.bets && isLoggedInUserInLeague()}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#if isLoggedInUserAdmin()}
    function create_if_block_1$7(ctx) {
    	let deleteleague;
    	let current;

    	deleteleague = new DeleteLeague({
    			props: { league: /*league*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(deleteleague.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(deleteleague, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const deleteleague_changes = {};
    			if (dirty & /*league*/ 1) deleteleague_changes.league = /*league*/ ctx[0];
    			deleteleague.$set(deleteleague_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(deleteleague.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(deleteleague.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(deleteleague, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(70:4) {#if isLoggedInUserAdmin()}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "container svelte-14p1h6l");
    			add_location(div, file$9, 52, 0, 1680);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(9, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('League', slots, []);
    	let { currentRoute } = $$props;
    	let league = {};
    	let users = {};
    	let regularSeasonLeaderboard = [];
    	let postSeasonLeaderboard = [];
    	let loading = false;

    	onMount(async () => {
    		$$invalidate(4, loading = true);

    		try {
    			const leagueId = currentRoute.namedParams.id;
    			$$invalidate(0, league = await fetchLeague($loggedInUser, leagueId));
    			$$invalidate(2, regularSeasonLeaderboard = league.leaderboards["Reg"].leaderBoardEntries);
    			$$invalidate(3, postSeasonLeaderboard = league.leaderboards["Post"].leaderBoardEntries);
    			$$invalidate(1, users = league.users);
    			$$invalidate(4, loading = false);
    		} catch(err) {
    			$$invalidate(4, loading = false);
    		}
    	});

    	function isLoggedInUserInLeague() {
    		return Object.keys(users).includes($loggedInUser.id);
    	}

    	function isLoggedInUserAdmin() {
    		return $loggedInUser?.id === league?.admin?.id;
    	}

    	async function handleJoinLeagueSuccess() {
    		$$invalidate(4, loading = true);

    		try {
    			const leagueId = currentRoute.namedParams.id;
    			$$invalidate(0, league = await fetchLeague($loggedInUser, leagueId));
    			$$invalidate(2, regularSeasonLeaderboard = league.leaderboards["Reg"].leaderBoardEntries);
    			$$invalidate(3, postSeasonLeaderboard = league.leaderboards["Post"].leaderBoardEntries);
    			$$invalidate(1, users = league.users);
    			$$invalidate(4, loading = false);
    		} catch(err) {
    			$$invalidate(4, loading = false);
    		}
    	}

    	const writable_props = ['currentRoute'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<League> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(8, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => ({
    		fetchLeague,
    		onMount,
    		loggedInUser,
    		DisplayBets,
    		LoadingIndicator,
    		DeleteLeague,
    		JoinLeague,
    		Leaderboard,
    		currentRoute,
    		league,
    		users,
    		regularSeasonLeaderboard,
    		postSeasonLeaderboard,
    		loading,
    		isLoggedInUserInLeague,
    		isLoggedInUserAdmin,
    		handleJoinLeagueSuccess,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(8, currentRoute = $$props.currentRoute);
    		if ('league' in $$props) $$invalidate(0, league = $$props.league);
    		if ('users' in $$props) $$invalidate(1, users = $$props.users);
    		if ('regularSeasonLeaderboard' in $$props) $$invalidate(2, regularSeasonLeaderboard = $$props.regularSeasonLeaderboard);
    		if ('postSeasonLeaderboard' in $$props) $$invalidate(3, postSeasonLeaderboard = $$props.postSeasonLeaderboard);
    		if ('loading' in $$props) $$invalidate(4, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		league,
    		users,
    		regularSeasonLeaderboard,
    		postSeasonLeaderboard,
    		loading,
    		isLoggedInUserInLeague,
    		isLoggedInUserAdmin,
    		handleJoinLeagueSuccess,
    		currentRoute
    	];
    }

    class League extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { currentRoute: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "League",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentRoute*/ ctx[8] === undefined && !('currentRoute' in props)) {
    			console.warn("<League> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<League>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<League>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const parseNumber = parseFloat;

    function joinCss(obj, separator = ';') {
      let texts;
      if (Array.isArray(obj)) {
        texts = obj.filter((text) => text);
      } else {
        texts = [];
        for (const prop in obj) {
          if (obj[prop]) {
            texts.push(`${prop}:${obj[prop]}`);
          }
        }
      }
      return texts.join(separator);
    }

    function getStyles(style, size, pull, fw) {
      let float;
      let width;
      const height = '1em';
      let lineHeight;
      let fontSize;
      let textAlign;
      let verticalAlign = '-.125em';
      const overflow = 'visible';

      if (fw) {
        textAlign = 'center';
        width = '1.25em';
      }

      if (pull) {
        float = pull;
      }

      if (size) {
        if (size == 'lg') {
          fontSize = '1.33333em';
          lineHeight = '.75em';
          verticalAlign = '-.225em';
        } else if (size == 'xs') {
          fontSize = '.75em';
        } else if (size == 'sm') {
          fontSize = '.875em';
        } else {
          fontSize = size.replace('x', 'em');
        }
      }

      return joinCss([
        joinCss({
          float,
          width,
          height,
          'line-height': lineHeight,
          'font-size': fontSize,
          'text-align': textAlign,
          'vertical-align': verticalAlign,
          'transform-origin': 'center',
          overflow,
        }),
        style,
      ]);
    }

    function getTransform(
      scale,
      translateX,
      translateY,
      rotate,
      flip,
      translateTimes = 1,
      translateUnit = '',
      rotateUnit = '',
    ) {
      let flipX = 1;
      let flipY = 1;

      if (flip) {
        if (flip == 'horizontal') {
          flipX = -1;
        } else if (flip == 'vertical') {
          flipY = -1;
        } else {
          flipX = flipY = -1;
        }
      }

      return joinCss(
        [
          `translate(${parseNumber(translateX) * translateTimes}${translateUnit},${parseNumber(translateY) * translateTimes}${translateUnit})`,
          `scale(${flipX * parseNumber(scale)},${flipY * parseNumber(scale)})`,
          rotate && `rotate(${rotate}${rotateUnit})`,
        ],
        ' ',
      );
    }

    /* node_modules\svelte-fa\src\fa.svelte generated by Svelte v3.49.0 */
    const file$8 = "node_modules\\svelte-fa\\src\\fa.svelte";

    // (78:0) {#if i[4]}
    function create_if_block$6(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let g1_transform_value;
    	let g1_transform_origin_value;
    	let svg_class_value;
    	let svg_viewBox_value;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*i*/ ctx[7][4] == 'string') return create_if_block_1$6;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			if_block.c();
    			attr_dev(g0, "transform", /*transform*/ ctx[10]);
    			add_location(g0, file$8, 91, 6, 1469);
    			attr_dev(g1, "transform", g1_transform_value = `translate(${/*i*/ ctx[7][0] / 2} ${/*i*/ ctx[7][1] / 2})`);
    			attr_dev(g1, "transform-origin", g1_transform_origin_value = `${/*i*/ ctx[7][0] / 4} 0`);
    			add_location(g1, file$8, 87, 4, 1358);
    			attr_dev(svg, "id", /*id*/ ctx[0]);
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*c*/ ctx[8]) + " svelte-1cj2gr0"));
    			attr_dev(svg, "style", /*s*/ ctx[9]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = `0 0 ${/*i*/ ctx[7][0]} ${/*i*/ ctx[7][1]}`);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$8, 78, 2, 1195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			if_block.m(g0, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(g0, null);
    				}
    			}

    			if (dirty & /*transform*/ 1024) {
    				attr_dev(g0, "transform", /*transform*/ ctx[10]);
    			}

    			if (dirty & /*i*/ 128 && g1_transform_value !== (g1_transform_value = `translate(${/*i*/ ctx[7][0] / 2} ${/*i*/ ctx[7][1] / 2})`)) {
    				attr_dev(g1, "transform", g1_transform_value);
    			}

    			if (dirty & /*i*/ 128 && g1_transform_origin_value !== (g1_transform_origin_value = `${/*i*/ ctx[7][0] / 4} 0`)) {
    				attr_dev(g1, "transform-origin", g1_transform_origin_value);
    			}

    			if (dirty & /*id*/ 1) {
    				attr_dev(svg, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*c*/ 256 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*c*/ ctx[8]) + " svelte-1cj2gr0"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*s*/ 512) {
    				attr_dev(svg, "style", /*s*/ ctx[9]);
    			}

    			if (dirty & /*i*/ 128 && svg_viewBox_value !== (svg_viewBox_value = `0 0 ${/*i*/ ctx[7][0]} ${/*i*/ ctx[7][1]}`)) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(78:0) {#if i[4]}",
    		ctx
    	});

    	return block;
    }

    // (99:8) {:else}
    function create_else_block$4(ctx) {
    	let path0;
    	let path0_d_value;
    	let path0_fill_value;
    	let path0_fill_opacity_value;
    	let path0_transform_value;
    	let path1;
    	let path1_d_value;
    	let path1_fill_value;
    	let path1_fill_opacity_value;
    	let path1_transform_value;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", path0_d_value = /*i*/ ctx[7][4][0]);
    			attr_dev(path0, "fill", path0_fill_value = /*secondaryColor*/ ctx[3] || /*color*/ ctx[1] || 'currentColor');

    			attr_dev(path0, "fill-opacity", path0_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*primaryOpacity*/ ctx[4]
    			: /*secondaryOpacity*/ ctx[5]);

    			attr_dev(path0, "transform", path0_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path0, file$8, 99, 10, 1721);
    			attr_dev(path1, "d", path1_d_value = /*i*/ ctx[7][4][1]);
    			attr_dev(path1, "fill", path1_fill_value = /*primaryColor*/ ctx[2] || /*color*/ ctx[1] || 'currentColor');

    			attr_dev(path1, "fill-opacity", path1_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*secondaryOpacity*/ ctx[5]
    			: /*primaryOpacity*/ ctx[4]);

    			attr_dev(path1, "transform", path1_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path1, file$8, 105, 10, 1982);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*i*/ 128 && path0_d_value !== (path0_d_value = /*i*/ ctx[7][4][0])) {
    				attr_dev(path0, "d", path0_d_value);
    			}

    			if (dirty & /*secondaryColor, color*/ 10 && path0_fill_value !== (path0_fill_value = /*secondaryColor*/ ctx[3] || /*color*/ ctx[1] || 'currentColor')) {
    				attr_dev(path0, "fill", path0_fill_value);
    			}

    			if (dirty & /*swapOpacity, primaryOpacity, secondaryOpacity*/ 112 && path0_fill_opacity_value !== (path0_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*primaryOpacity*/ ctx[4]
    			: /*secondaryOpacity*/ ctx[5])) {
    				attr_dev(path0, "fill-opacity", path0_fill_opacity_value);
    			}

    			if (dirty & /*i*/ 128 && path0_transform_value !== (path0_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path0, "transform", path0_transform_value);
    			}

    			if (dirty & /*i*/ 128 && path1_d_value !== (path1_d_value = /*i*/ ctx[7][4][1])) {
    				attr_dev(path1, "d", path1_d_value);
    			}

    			if (dirty & /*primaryColor, color*/ 6 && path1_fill_value !== (path1_fill_value = /*primaryColor*/ ctx[2] || /*color*/ ctx[1] || 'currentColor')) {
    				attr_dev(path1, "fill", path1_fill_value);
    			}

    			if (dirty & /*swapOpacity, secondaryOpacity, primaryOpacity*/ 112 && path1_fill_opacity_value !== (path1_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*secondaryOpacity*/ ctx[5]
    			: /*primaryOpacity*/ ctx[4])) {
    				attr_dev(path1, "fill-opacity", path1_fill_opacity_value);
    			}

    			if (dirty & /*i*/ 128 && path1_transform_value !== (path1_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path1, "transform", path1_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(99:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:8) {#if typeof i[4] == 'string'}
    function create_if_block_1$6(ctx) {
    	let path;
    	let path_d_value;
    	let path_fill_value;
    	let path_transform_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*i*/ ctx[7][4]);
    			attr_dev(path, "fill", path_fill_value = /*color*/ ctx[1] || /*primaryColor*/ ctx[2] || 'currentColor');
    			attr_dev(path, "transform", path_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path, file$8, 93, 10, 1533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*i*/ 128 && path_d_value !== (path_d_value = /*i*/ ctx[7][4])) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*color, primaryColor*/ 6 && path_fill_value !== (path_fill_value = /*color*/ ctx[1] || /*primaryColor*/ ctx[2] || 'currentColor')) {
    				attr_dev(path, "fill", path_fill_value);
    			}

    			if (dirty & /*i*/ 128 && path_transform_value !== (path_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path, "transform", path_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(93:8) {#if typeof i[4] == 'string'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[7][4] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*i*/ ctx[7][4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fa', slots, []);
    	let { class: clazz = '' } = $$props;
    	let { id = '' } = $$props;
    	let { style = '' } = $$props;
    	let { icon } = $$props;
    	let { size = '' } = $$props;
    	let { color = '' } = $$props;
    	let { fw = false } = $$props;
    	let { pull = '' } = $$props;
    	let { scale = 1 } = $$props;
    	let { translateX = 0 } = $$props;
    	let { translateY = 0 } = $$props;
    	let { rotate = '' } = $$props;
    	let { flip = false } = $$props;
    	let { spin = false } = $$props;
    	let { pulse = false } = $$props;
    	let { primaryColor = '' } = $$props;
    	let { secondaryColor = '' } = $$props;
    	let { primaryOpacity = 1 } = $$props;
    	let { secondaryOpacity = 0.4 } = $$props;
    	let { swapOpacity = false } = $$props;
    	let i;
    	let c;
    	let s;
    	let transform;

    	const writable_props = [
    		'class',
    		'id',
    		'style',
    		'icon',
    		'size',
    		'color',
    		'fw',
    		'pull',
    		'scale',
    		'translateX',
    		'translateY',
    		'rotate',
    		'flip',
    		'spin',
    		'pulse',
    		'primaryColor',
    		'secondaryColor',
    		'primaryOpacity',
    		'secondaryOpacity',
    		'swapOpacity'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Fa> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(11, clazz = $$props.class);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('style' in $$props) $$invalidate(12, style = $$props.style);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(14, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('fw' in $$props) $$invalidate(15, fw = $$props.fw);
    		if ('pull' in $$props) $$invalidate(16, pull = $$props.pull);
    		if ('scale' in $$props) $$invalidate(17, scale = $$props.scale);
    		if ('translateX' in $$props) $$invalidate(18, translateX = $$props.translateX);
    		if ('translateY' in $$props) $$invalidate(19, translateY = $$props.translateY);
    		if ('rotate' in $$props) $$invalidate(20, rotate = $$props.rotate);
    		if ('flip' in $$props) $$invalidate(21, flip = $$props.flip);
    		if ('spin' in $$props) $$invalidate(22, spin = $$props.spin);
    		if ('pulse' in $$props) $$invalidate(23, pulse = $$props.pulse);
    		if ('primaryColor' in $$props) $$invalidate(2, primaryColor = $$props.primaryColor);
    		if ('secondaryColor' in $$props) $$invalidate(3, secondaryColor = $$props.secondaryColor);
    		if ('primaryOpacity' in $$props) $$invalidate(4, primaryOpacity = $$props.primaryOpacity);
    		if ('secondaryOpacity' in $$props) $$invalidate(5, secondaryOpacity = $$props.secondaryOpacity);
    		if ('swapOpacity' in $$props) $$invalidate(6, swapOpacity = $$props.swapOpacity);
    	};

    	$$self.$capture_state = () => ({
    		joinCss,
    		getStyles,
    		getTransform,
    		clazz,
    		id,
    		style,
    		icon,
    		size,
    		color,
    		fw,
    		pull,
    		scale,
    		translateX,
    		translateY,
    		rotate,
    		flip,
    		spin,
    		pulse,
    		primaryColor,
    		secondaryColor,
    		primaryOpacity,
    		secondaryOpacity,
    		swapOpacity,
    		i,
    		c,
    		s,
    		transform
    	});

    	$$self.$inject_state = $$props => {
    		if ('clazz' in $$props) $$invalidate(11, clazz = $$props.clazz);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('style' in $$props) $$invalidate(12, style = $$props.style);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(14, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('fw' in $$props) $$invalidate(15, fw = $$props.fw);
    		if ('pull' in $$props) $$invalidate(16, pull = $$props.pull);
    		if ('scale' in $$props) $$invalidate(17, scale = $$props.scale);
    		if ('translateX' in $$props) $$invalidate(18, translateX = $$props.translateX);
    		if ('translateY' in $$props) $$invalidate(19, translateY = $$props.translateY);
    		if ('rotate' in $$props) $$invalidate(20, rotate = $$props.rotate);
    		if ('flip' in $$props) $$invalidate(21, flip = $$props.flip);
    		if ('spin' in $$props) $$invalidate(22, spin = $$props.spin);
    		if ('pulse' in $$props) $$invalidate(23, pulse = $$props.pulse);
    		if ('primaryColor' in $$props) $$invalidate(2, primaryColor = $$props.primaryColor);
    		if ('secondaryColor' in $$props) $$invalidate(3, secondaryColor = $$props.secondaryColor);
    		if ('primaryOpacity' in $$props) $$invalidate(4, primaryOpacity = $$props.primaryOpacity);
    		if ('secondaryOpacity' in $$props) $$invalidate(5, secondaryOpacity = $$props.secondaryOpacity);
    		if ('swapOpacity' in $$props) $$invalidate(6, swapOpacity = $$props.swapOpacity);
    		if ('i' in $$props) $$invalidate(7, i = $$props.i);
    		if ('c' in $$props) $$invalidate(8, c = $$props.c);
    		if ('s' in $$props) $$invalidate(9, s = $$props.s);
    		if ('transform' in $$props) $$invalidate(10, transform = $$props.transform);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*icon*/ 8192) {
    			$$invalidate(7, i = icon && icon.icon || [0, 0, '', [], '']);
    		}

    		if ($$self.$$.dirty & /*clazz, spin, pulse*/ 12584960) {
    			$$invalidate(8, c = joinCss([clazz, 'svelte-fa', spin && 'spin', pulse && 'pulse'], ' '));
    		}

    		if ($$self.$$.dirty & /*style, size, pull, fw*/ 118784) {
    			$$invalidate(9, s = getStyles(style, size, pull, fw));
    		}

    		if ($$self.$$.dirty & /*scale, translateX, translateY, rotate, flip*/ 4063232) {
    			$$invalidate(10, transform = getTransform(scale, translateX, translateY, rotate, flip, 512));
    		}
    	};

    	return [
    		id,
    		color,
    		primaryColor,
    		secondaryColor,
    		primaryOpacity,
    		secondaryOpacity,
    		swapOpacity,
    		i,
    		c,
    		s,
    		transform,
    		clazz,
    		style,
    		icon,
    		size,
    		fw,
    		pull,
    		scale,
    		translateX,
    		translateY,
    		rotate,
    		flip,
    		spin,
    		pulse
    	];
    }

    class Fa extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			class: 11,
    			id: 0,
    			style: 12,
    			icon: 13,
    			size: 14,
    			color: 1,
    			fw: 15,
    			pull: 16,
    			scale: 17,
    			translateX: 18,
    			translateY: 19,
    			rotate: 20,
    			flip: 21,
    			spin: 22,
    			pulse: 23,
    			primaryColor: 2,
    			secondaryColor: 3,
    			primaryOpacity: 4,
    			secondaryOpacity: 5,
    			swapOpacity: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fa",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[13] === undefined && !('icon' in props)) {
    			console.warn("<Fa> was created without expected prop 'icon'");
    		}
    	}

    	get class() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fw() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fw(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pull() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pull(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateX() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateX(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateY() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateY(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotate() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotate(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryColor() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryColor(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryColor() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryColor(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swapOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swapOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */
    var faFootballBall = {
      prefix: 'fas',
      iconName: 'football-ball',
      icon: [496, 512, [], "f44e", "M481.5 60.3c-4.8-18.2-19.1-32.5-37.3-37.4C420.3 16.5 383 8.9 339.4 8L496 164.8c-.8-43.5-8.2-80.6-14.5-104.5zm-467 391.4c4.8 18.2 19.1 32.5 37.3 37.4 23.9 6.4 61.2 14 104.8 14.9L0 347.2c.8 43.5 8.2 80.6 14.5 104.5zM4.2 283.4L220.4 500c132.5-19.4 248.8-118.7 271.5-271.4L275.6 12C143.1 31.4 26.8 130.7 4.2 283.4zm317.3-123.6c3.1-3.1 8.2-3.1 11.3 0l11.3 11.3c3.1 3.1 3.1 8.2 0 11.3l-28.3 28.3 28.3 28.3c3.1 3.1 3.1 8.2 0 11.3l-11.3 11.3c-3.1 3.1-8.2 3.1-11.3 0l-28.3-28.3-22.6 22.7 28.3 28.3c3.1 3.1 3.1 8.2 0 11.3l-11.3 11.3c-3.1 3.1-8.2 3.1-11.3 0L248 278.6l-22.6 22.6 28.3 28.3c3.1 3.1 3.1 8.2 0 11.3l-11.3 11.3c-3.1 3.1-8.2 3.1-11.3 0l-28.3-28.3-28.3 28.3c-3.1 3.1-8.2 3.1-11.3 0l-11.3-11.3c-3.1-3.1-3.1-8.2 0-11.3l28.3-28.3-28.3-28.2c-3.1-3.1-3.1-8.2 0-11.3l11.3-11.3c3.1-3.1 8.2-3.1 11.3 0l28.3 28.3 22.6-22.6-28.3-28.3c-3.1-3.1-3.1-8.2 0-11.3l11.3-11.3c3.1-3.1 8.2-3.1 11.3 0l28.3 28.3 22.6-22.6-28.3-28.3c-3.1-3.1-3.1-8.2 0-11.3l11.3-11.3c3.1-3.1 8.2-3.1 11.3 0l28.3 28.3 28.3-28.5z"]
    };

    /* src\Game.svelte generated by Svelte v3.49.0 */
    const file$7 = "src\\Game.svelte";

    // (77:6) {#if !game.isFinished && !game.isOngoing && game.awayTeam.record}
    function create_if_block_9(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*game*/ ctx[2].awayTeam.record + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("(");
    			t1 = text(t1_value);
    			t2 = text(")");
    			attr_dev(span, "class", "record svelte-nlkmcc");
    			add_location(span, file$7, 77, 8, 2250);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t1_value !== (t1_value = /*game*/ ctx[2].awayTeam.record + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(77:6) {#if !game.isFinished && !game.isOngoing && game.awayTeam.record}",
    		ctx
    	});

    	return block;
    }

    // (87:4) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let i;
    	let t_value = displayScore(/*game*/ ctx[2], /*game*/ ctx[2].awayTeamScore) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text(t_value);
    			add_location(i, file$7, 88, 8, 2565);
    			attr_dev(div, "class", "not-finished-score svelte-nlkmcc");
    			add_location(div, file$7, 87, 6, 2523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(i, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t_value !== (t_value = displayScore(/*game*/ ctx[2], /*game*/ ctx[2].awayTeamScore) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(87:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (83:4) {#if game.isFinished}
    function create_if_block_8(ctx) {
    	let div;
    	let t_value = /*game*/ ctx[2].awayTeamScore + "";
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*game*/ ctx[2]?.awayTeam?.id === /*game*/ ctx[2]?.winner?.id
    			? "winner"
    			: "loser") + " svelte-nlkmcc"));

    			add_location(div, file$7, 83, 6, 2384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t_value !== (t_value = /*game*/ ctx[2].awayTeamScore + "")) set_data_dev(t, t_value);

    			if (dirty & /*game*/ 4 && div_class_value !== (div_class_value = "" + (null_to_empty(/*game*/ ctx[2]?.awayTeam?.id === /*game*/ ctx[2]?.winner?.id
    			? "winner"
    			: "loser") + " svelte-nlkmcc"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(83:4) {#if game.isFinished}",
    		ctx
    	});

    	return block;
    }

    // (92:4) {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
    function create_if_block_7(ctx) {
    	let div0;
    	let t0_value = (/*game*/ ctx[2].awayTeamOdds || "N/A") + "";
    	let t0;
    	let t1;
    	let div1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			attr_dev(div0, "class", "odds svelte-nlkmcc");
    			add_location(div0, file$7, 92, 6, 2712);
    			attr_dev(input, "type", "radio");
    			input.__value = input_value_value = /*game*/ ctx[2].awayTeam.id;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input);
    			add_location(input, file$7, 94, 8, 2801);
    			attr_dev(div1, "class", "input svelte-nlkmcc");
    			add_location(div1, file$7, 93, 6, 2772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			input.checked = input.__value === /*choices*/ ctx[0][/*game*/ ctx[2].id];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t0_value !== (t0_value = (/*game*/ ctx[2].awayTeamOdds || "N/A") + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*game*/ 4 && input_value_value !== (input_value_value = /*game*/ ctx[2].awayTeam.id)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*choices, game*/ 5) {
    				input.checked = input.__value === /*choices*/ ctx[0][/*game*/ ctx[2].id];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(92:4) {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}",
    		ctx
    	});

    	return block;
    }

    // (99:6) {#if isBetOnTeam(game, game.awayTeam, existingBets)}
    function create_if_block_6(ctx) {
    	let t0_value = /*game*/ ctx[2].awayTeam.abbreviation + "";
    	let t0;
    	let t1;
    	let b;
    	let t3;
    	let t4_value = getBetByGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]).game.awayTeamOdds + "";
    	let t4;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			b = element("b");
    			b.textContent = "@";
    			t3 = space();
    			t4 = text(t4_value);
    			attr_dev(b, "class", "svelte-nlkmcc");
    			add_location(b, file$7, 99, 37, 3030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, b, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t0_value !== (t0_value = /*game*/ ctx[2].awayTeam.abbreviation + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*game, existingBets*/ 6 && t4_value !== (t4_value = getBetByGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]).game.awayTeamOdds + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(99:6) {#if isBetOnTeam(game, game.awayTeam, existingBets)}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#if game.isOngoing && game.ongoingGameProperties?.teamWithPossession?.id === game.awayTeam.id && innerWidth > 1000}
    function create_if_block_5(ctx) {
    	let div;
    	let fa;
    	let t0;
    	let span;
    	let t1_value = displayDownAndDistance(/*innerWidth*/ ctx[3], /*game*/ ctx[2]) + "";
    	let t1;
    	let current;

    	fa = new Fa({
    			props: { icon: faFootballBall, size: "s" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(fa.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			attr_dev(span, "class", "svelte-nlkmcc");
    			add_location(span, file$7, 106, 8, 3359);
    			set_style(div, "color", "white");
    			attr_dev(div, "class", "game-status svelte-nlkmcc");
    			add_location(div, file$7, 104, 6, 3255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(fa, div, null);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*innerWidth, game*/ 12) && t1_value !== (t1_value = displayDownAndDistance(/*innerWidth*/ ctx[3], /*game*/ ctx[2]) + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fa.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fa.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(fa);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(104:4) {#if game.isOngoing && game.ongoingGameProperties?.teamWithPossession?.id === game.awayTeam.id && innerWidth > 1000}",
    		ctx
    	});

    	return block;
    }

    // (119:6) {#if !game.isFinished && !game.isOngoing && game.homeTeam.record}
    function create_if_block_4(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*game*/ ctx[2].homeTeam.record + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("(");
    			t1 = text(t1_value);
    			t2 = text(")");
    			attr_dev(span, "class", "record svelte-nlkmcc");
    			add_location(span, file$7, 119, 8, 3798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t1_value !== (t1_value = /*game*/ ctx[2].homeTeam.record + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(119:6) {#if !game.isFinished && !game.isOngoing && game.homeTeam.record}",
    		ctx
    	});

    	return block;
    }

    // (129:4) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let i;
    	let t_value = displayScore(/*game*/ ctx[2], /*game*/ ctx[2].homeTeamScore) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text(t_value);
    			add_location(i, file$7, 130, 8, 4113);
    			attr_dev(div, "class", "not-finished-score svelte-nlkmcc");
    			add_location(div, file$7, 129, 6, 4071);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(i, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t_value !== (t_value = displayScore(/*game*/ ctx[2], /*game*/ ctx[2].homeTeamScore) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(129:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (125:4) {#if game.isFinished}
    function create_if_block_3(ctx) {
    	let div;
    	let t_value = /*game*/ ctx[2].homeTeamScore + "";
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*game*/ ctx[2]?.homeTeam?.id === /*game*/ ctx[2]?.winner?.id
    			? "winner"
    			: "loser") + " svelte-nlkmcc"));

    			add_location(div, file$7, 125, 6, 3932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t_value !== (t_value = /*game*/ ctx[2].homeTeamScore + "")) set_data_dev(t, t_value);

    			if (dirty & /*game*/ 4 && div_class_value !== (div_class_value = "" + (null_to_empty(/*game*/ ctx[2]?.homeTeam?.id === /*game*/ ctx[2]?.winner?.id
    			? "winner"
    			: "loser") + " svelte-nlkmcc"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(125:4) {#if game.isFinished}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
    function create_if_block_2$1(ctx) {
    	let div0;
    	let t0_value = (/*game*/ ctx[2].homeTeamOdds || "N/A") + "";
    	let t0;
    	let t1;
    	let div1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			attr_dev(div0, "class", "odds svelte-nlkmcc");
    			add_location(div0, file$7, 134, 6, 4260);
    			attr_dev(input, "type", "radio");
    			input.__value = input_value_value = /*game*/ ctx[2].homeTeam.id;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input);
    			add_location(input, file$7, 136, 8, 4349);
    			attr_dev(div1, "class", "input svelte-nlkmcc");
    			add_location(div1, file$7, 135, 6, 4320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			input.checked = input.__value === /*choices*/ ctx[0][/*game*/ ctx[2].id];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t0_value !== (t0_value = (/*game*/ ctx[2].homeTeamOdds || "N/A") + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*game*/ 4 && input_value_value !== (input_value_value = /*game*/ ctx[2].homeTeam.id)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*choices, game*/ 5) {
    				input.checked = input.__value === /*choices*/ ctx[0][/*game*/ ctx[2].id];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(134:4) {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}",
    		ctx
    	});

    	return block;
    }

    // (141:6) {#if isBetOnTeam(game, game.homeTeam, existingBets)}
    function create_if_block_1$5(ctx) {
    	let t0_value = /*game*/ ctx[2].homeTeam.abbreviation + "";
    	let t0;
    	let t1;
    	let b;
    	let t3;
    	let t4_value = getBetByGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]).game.homeTeamOdds + "";
    	let t4;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			b = element("b");
    			b.textContent = "@";
    			t3 = space();
    			t4 = text(t4_value);
    			attr_dev(b, "class", "svelte-nlkmcc");
    			add_location(b, file$7, 141, 37, 4578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, b, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 4 && t0_value !== (t0_value = /*game*/ ctx[2].homeTeam.abbreviation + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*game, existingBets*/ 6 && t4_value !== (t4_value = getBetByGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]).game.homeTeamOdds + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(141:6) {#if isBetOnTeam(game, game.homeTeam, existingBets)}",
    		ctx
    	});

    	return block;
    }

    // (146:4) {#if game.isOngoing && game.ongoingGameProperties?.teamWithPossession?.id === game.homeTeam.id && innerWidth > 1000}
    function create_if_block$5(ctx) {
    	let div;
    	let fa;
    	let t0;
    	let span;
    	let t1_value = displayDownAndDistance(/*innerWidth*/ ctx[3], /*game*/ ctx[2]) + "";
    	let t1;
    	let current;

    	fa = new Fa({
    			props: { icon: faFootballBall, size: "s" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(fa.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			attr_dev(span, "class", "svelte-nlkmcc");
    			add_location(span, file$7, 148, 8, 4907);
    			set_style(div, "color", "white");
    			attr_dev(div, "class", "game-status svelte-nlkmcc");
    			add_location(div, file$7, 146, 6, 4803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(fa, div, null);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*innerWidth, game*/ 12) && t1_value !== (t1_value = displayDownAndDistance(/*innerWidth*/ ctx[3], /*game*/ ctx[2]) + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fa.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fa.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(fa);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(146:4) {#if game.isOngoing && game.ongoingGameProperties?.teamWithPossession?.id === game.homeTeam.id && innerWidth > 1000}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div7;
    	let div0;
    	let i;
    	let b0;
    	let t0_value = displayDate(/*game*/ ctx[2]) + "";
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let span0;
    	let img0;
    	let img0_src_value;
    	let img0_alt_value;
    	let t2;
    	let span1;
    	let b1;
    	let t3_value = displayTeamName$1(/*innerWidth*/ ctx[3], /*game*/ ctx[2].awayTeam) + "";
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let show_if_3 = !hasUserBetOnGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]) && /*game*/ ctx[2].isBetable;
    	let t7;
    	let div2;
    	let show_if_2 = isBetOnTeam(/*game*/ ctx[2], /*game*/ ctx[2].awayTeam, /*existingBets*/ ctx[1]);
    	let t8;
    	let t9;
    	let div6;
    	let div4;
    	let span2;
    	let img1;
    	let img1_src_value;
    	let img1_alt_value;
    	let t10;
    	let span3;
    	let b2;
    	let t11_value = displayTeamName$1(/*innerWidth*/ ctx[3], /*game*/ ctx[2].homeTeam) + "";
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let show_if_1 = !hasUserBetOnGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]) && /*game*/ ctx[2].isBetable;
    	let t15;
    	let div5;
    	let show_if = isBetOnTeam(/*game*/ ctx[2], /*game*/ ctx[2].homeTeam, /*existingBets*/ ctx[1]);
    	let t16;
    	let div7_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[4]);
    	let if_block0 = !/*game*/ ctx[2].isFinished && !/*game*/ ctx[2].isOngoing && /*game*/ ctx[2].awayTeam.record && create_if_block_9(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*game*/ ctx[2].isFinished) return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = show_if_3 && create_if_block_7(ctx);
    	let if_block3 = show_if_2 && create_if_block_6(ctx);
    	let if_block4 = /*game*/ ctx[2].isOngoing && /*game*/ ctx[2].ongoingGameProperties?.teamWithPossession?.id === /*game*/ ctx[2].awayTeam.id && /*innerWidth*/ ctx[3] > 1000 && create_if_block_5(ctx);
    	let if_block5 = !/*game*/ ctx[2].isFinished && !/*game*/ ctx[2].isOngoing && /*game*/ ctx[2].homeTeam.record && create_if_block_4(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*game*/ ctx[2].isFinished) return create_if_block_3;
    		return create_else_block$3;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block6 = current_block_type_1(ctx);
    	let if_block7 = show_if_1 && create_if_block_2$1(ctx);
    	let if_block8 = show_if && create_if_block_1$5(ctx);
    	let if_block9 = /*game*/ ctx[2].isOngoing && /*game*/ ctx[2].ongoingGameProperties?.teamWithPossession?.id === /*game*/ ctx[2].homeTeam.id && /*innerWidth*/ ctx[3] > 1000 && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			i = element("i");
    			b0 = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			img0 = element("img");
    			t2 = space();
    			span1 = element("span");
    			b1 = element("b");
    			t3 = text(t3_value);
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			t7 = space();
    			div2 = element("div");
    			if (if_block3) if_block3.c();
    			t8 = space();
    			if (if_block4) if_block4.c();
    			t9 = space();
    			div6 = element("div");
    			div4 = element("div");
    			span2 = element("span");
    			img1 = element("img");
    			t10 = space();
    			span3 = element("span");
    			b2 = element("b");
    			t11 = text(t11_value);
    			t12 = space();
    			if (if_block5) if_block5.c();
    			t13 = space();
    			if_block6.c();
    			t14 = space();
    			if (if_block7) if_block7.c();
    			t15 = space();
    			div5 = element("div");
    			if (if_block8) if_block8.c();
    			t16 = space();
    			if (if_block9) if_block9.c();
    			attr_dev(b0, "class", "svelte-nlkmcc");
    			add_location(b0, file$7, 66, 7, 1863);
    			add_location(i, file$7, 66, 4, 1860);
    			attr_dev(div0, "class", "start-time svelte-nlkmcc");
    			add_location(div0, file$7, 65, 2, 1830);
    			if (!src_url_equal(img0.src, img0_src_value = /*game*/ ctx[2].awayTeam.logo)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", img0_alt_value = /*game*/ ctx[2].awayTeam.name);
    			attr_dev(img0, "class", "svelte-nlkmcc");
    			add_location(img0, file$7, 71, 8, 1987);
    			attr_dev(span0, "class", "svelte-nlkmcc");
    			add_location(span0, file$7, 70, 6, 1971);
    			attr_dev(b1, "class", "svelte-nlkmcc");
    			add_location(b1, file$7, 74, 8, 2101);
    			attr_dev(span1, "class", "team-name svelte-nlkmcc");
    			add_location(span1, file$7, 73, 6, 2067);
    			attr_dev(div1, "class", "team-name-and-logo svelte-nlkmcc");
    			add_location(div1, file$7, 69, 4, 1931);
    			attr_dev(div2, "class", "user-bet svelte-nlkmcc");
    			add_location(div2, file$7, 97, 4, 2909);
    			attr_dev(div3, "class", "team svelte-nlkmcc");
    			add_location(div3, file$7, 68, 2, 1907);
    			if (!src_url_equal(img1.src, img1_src_value = /*game*/ ctx[2].homeTeam.logo)) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", img1_alt_value = /*game*/ ctx[2].homeTeam.name);
    			attr_dev(img1, "class", "svelte-nlkmcc");
    			add_location(img1, file$7, 113, 8, 3535);
    			attr_dev(span2, "class", "svelte-nlkmcc");
    			add_location(span2, file$7, 112, 6, 3519);
    			attr_dev(b2, "class", "svelte-nlkmcc");
    			add_location(b2, file$7, 116, 8, 3649);
    			attr_dev(span3, "class", "team-name svelte-nlkmcc");
    			add_location(span3, file$7, 115, 6, 3615);
    			attr_dev(div4, "class", "team-name-and-logo svelte-nlkmcc");
    			add_location(div4, file$7, 111, 4, 3479);
    			attr_dev(div5, "class", "user-bet svelte-nlkmcc");
    			add_location(div5, file$7, 139, 4, 4457);
    			attr_dev(div6, "class", "team svelte-nlkmcc");
    			add_location(div6, file$7, 110, 2, 3455);
    			attr_dev(div7, "class", div7_class_value = "" + (null_to_empty(getGameCardClass(/*existingBets*/ ctx[1], /*game*/ ctx[2])) + " svelte-nlkmcc"));
    			add_location(div7, file$7, 64, 0, 1776);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, i);
    			append_dev(i, b0);
    			append_dev(b0, t0);
    			append_dev(div7, t1);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(span0, img0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(span1, b1);
    			append_dev(b1, t3);
    			append_dev(div1, t4);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div3, t5);
    			if_block1.m(div3, null);
    			append_dev(div3, t6);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div3, t8);
    			if (if_block4) if_block4.m(div3, null);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, span2);
    			append_dev(span2, img1);
    			append_dev(div4, t10);
    			append_dev(div4, span3);
    			append_dev(span3, b2);
    			append_dev(b2, t11);
    			append_dev(div4, t12);
    			if (if_block5) if_block5.m(div4, null);
    			append_dev(div6, t13);
    			if_block6.m(div6, null);
    			append_dev(div6, t14);
    			if (if_block7) if_block7.m(div6, null);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    			if (if_block8) if_block8.m(div5, null);
    			append_dev(div6, t16);
    			if (if_block9) if_block9.m(div6, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*game*/ 4) && t0_value !== (t0_value = displayDate(/*game*/ ctx[2]) + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*game*/ 4 && !src_url_equal(img0.src, img0_src_value = /*game*/ ctx[2].awayTeam.logo)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (!current || dirty & /*game*/ 4 && img0_alt_value !== (img0_alt_value = /*game*/ ctx[2].awayTeam.name)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if ((!current || dirty & /*innerWidth, game*/ 12) && t3_value !== (t3_value = displayTeamName$1(/*innerWidth*/ ctx[3], /*game*/ ctx[2].awayTeam) + "")) set_data_dev(t3, t3_value);

    			if (!/*game*/ ctx[2].isFinished && !/*game*/ ctx[2].isOngoing && /*game*/ ctx[2].awayTeam.record) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, t6);
    				}
    			}

    			if (dirty & /*game, existingBets*/ 6) show_if_3 = !hasUserBetOnGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]) && /*game*/ ctx[2].isBetable;

    			if (show_if_3) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_7(ctx);
    					if_block2.c();
    					if_block2.m(div3, t7);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*game, existingBets*/ 6) show_if_2 = isBetOnTeam(/*game*/ ctx[2], /*game*/ ctx[2].awayTeam, /*existingBets*/ ctx[1]);

    			if (show_if_2) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_6(ctx);
    					if_block3.c();
    					if_block3.m(div2, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*game*/ ctx[2].isOngoing && /*game*/ ctx[2].ongoingGameProperties?.teamWithPossession?.id === /*game*/ ctx[2].awayTeam.id && /*innerWidth*/ ctx[3] > 1000) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*game, innerWidth*/ 12) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_5(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div3, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*game*/ 4 && !src_url_equal(img1.src, img1_src_value = /*game*/ ctx[2].homeTeam.logo)) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (!current || dirty & /*game*/ 4 && img1_alt_value !== (img1_alt_value = /*game*/ ctx[2].homeTeam.name)) {
    				attr_dev(img1, "alt", img1_alt_value);
    			}

    			if ((!current || dirty & /*innerWidth, game*/ 12) && t11_value !== (t11_value = displayTeamName$1(/*innerWidth*/ ctx[3], /*game*/ ctx[2].homeTeam) + "")) set_data_dev(t11, t11_value);

    			if (!/*game*/ ctx[2].isFinished && !/*game*/ ctx[2].isOngoing && /*game*/ ctx[2].homeTeam.record) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_4(ctx);
    					if_block5.c();
    					if_block5.m(div4, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block6) {
    				if_block6.p(ctx, dirty);
    			} else {
    				if_block6.d(1);
    				if_block6 = current_block_type_1(ctx);

    				if (if_block6) {
    					if_block6.c();
    					if_block6.m(div6, t14);
    				}
    			}

    			if (dirty & /*game, existingBets*/ 6) show_if_1 = !hasUserBetOnGame(/*game*/ ctx[2], /*existingBets*/ ctx[1]) && /*game*/ ctx[2].isBetable;

    			if (show_if_1) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_2$1(ctx);
    					if_block7.c();
    					if_block7.m(div6, t15);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (dirty & /*game, existingBets*/ 6) show_if = isBetOnTeam(/*game*/ ctx[2], /*game*/ ctx[2].homeTeam, /*existingBets*/ ctx[1]);

    			if (show_if) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_1$5(ctx);
    					if_block8.c();
    					if_block8.m(div5, null);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*game*/ ctx[2].isOngoing && /*game*/ ctx[2].ongoingGameProperties?.teamWithPossession?.id === /*game*/ ctx[2].homeTeam.id && /*innerWidth*/ ctx[3] > 1000) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);

    					if (dirty & /*game, innerWidth*/ 12) {
    						transition_in(if_block9, 1);
    					}
    				} else {
    					if_block9 = create_if_block$5(ctx);
    					if_block9.c();
    					transition_in(if_block9, 1);
    					if_block9.m(div6, null);
    				}
    			} else if (if_block9) {
    				group_outros();

    				transition_out(if_block9, 1, 1, () => {
    					if_block9 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*existingBets, game*/ 6 && div7_class_value !== (div7_class_value = "" + (null_to_empty(getGameCardClass(/*existingBets*/ ctx[1], /*game*/ ctx[2])) + " svelte-nlkmcc"))) {
    				attr_dev(div7, "class", div7_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block4);
    			transition_in(if_block9);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block4);
    			transition_out(if_block9);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function displayTeamName$1(width, team) {
    	return width > 800 ? team.name : team.abbreviation;
    }

    function isBetSuccessful(bets, game) {
    	var existingBet = bets.find(b => b.game.id === game.id);
    	return existingBet ? existingBet.successful : false;
    }

    function getGameCardClass(existingBets, game) {
    	return game.isFinished && hasUserBetOnGame(game, existingBets)
    	? isBetSuccessful(existingBets, game)
    		? "game-card success"
    		: "game-card failure"
    	: "game-card";
    }

    function displayDate(game) {
    	const date = game.startTime;

    	if (game.isFinished) {
    		return "FINAL";
    	}

    	return `${new Date(date).toLocaleDateString("sv-SE")} ${new Date(date).toLocaleTimeString("sv-SE")}`;
    }

    function displayScore(game, score) {
    	if (game.isFinished || game.isOngoing) {
    		return score;
    	}

    	return "";
    }

    function displayDownAndDistance(width, game) {
    	if (width < 1000) {
    		return "";
    	}

    	return game.ongoingGameProperties?.downAndDistance || "";
    }

    function hasUserBetOnGame(game, existingBets) {
    	const existingBet = getBetByGame(game, existingBets);
    	return existingBet ? true : false;
    }

    function isBetOnTeam(game, team, existingBets) {
    	const bet = getBetByGame(game, existingBets);
    	return bet?.winningTeam?.id === team.id;
    }

    function getBetByGame(game, existingBets) {
    	return existingBets.find(b => b.game.id === game.id);
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let innerWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Game', slots, []);
    	let { existingBets = [] } = $$props;
    	let { choices = {} } = $$props;
    	let { game = {} } = $$props;
    	const writable_props = ['existingBets', 'choices', 'game'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function onwindowresize() {
    		$$invalidate(3, innerWidth = window.innerWidth);
    	}

    	function input_change_handler() {
    		choices[game.id] = this.__value;
    		$$invalidate(0, choices);
    	}

    	function input_change_handler_1() {
    		choices[game.id] = this.__value;
    		$$invalidate(0, choices);
    	}

    	$$self.$$set = $$props => {
    		if ('existingBets' in $$props) $$invalidate(1, existingBets = $$props.existingBets);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    		if ('game' in $$props) $$invalidate(2, game = $$props.game);
    	};

    	$$self.$capture_state = () => ({
    		Fa,
    		faFootballBall,
    		existingBets,
    		choices,
    		game,
    		displayTeamName: displayTeamName$1,
    		isBetSuccessful,
    		getGameCardClass,
    		displayDate,
    		displayScore,
    		displayDownAndDistance,
    		hasUserBetOnGame,
    		isBetOnTeam,
    		getBetByGame,
    		innerWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('existingBets' in $$props) $$invalidate(1, existingBets = $$props.existingBets);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    		if ('game' in $$props) $$invalidate(2, game = $$props.game);
    		if ('innerWidth' in $$props) $$invalidate(3, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(3, innerWidth = 0);

    	return [
    		choices,
    		existingBets,
    		game,
    		innerWidth,
    		onwindowresize,
    		input_change_handler,
    		$$binding_groups,
    		input_change_handler_1
    	];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { existingBets: 1, choices: 0, game: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get existingBets() {
    		throw new Error("<Game>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set existingBets(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choices() {
    		throw new Error("<Game>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get game() {
    		throw new Error("<Game>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set game(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\MakeBets.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1 } = globals;
    const file$6 = "src\\MakeBets.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (132:4) {:else}
    function create_else_block$2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "No games yet";
    			attr_dev(h2, "class", "svelte-12m5gy2");
    			add_location(h2, file$6, 132, 6, 3837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(132:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (121:109) 
    function create_if_block_2(ctx) {
    	let h2;
    	let t0_value = getPointsText(/*existingBets*/ ctx[2]) + "";
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let current;
    	let each_value = /*groupGamesByDate*/ ctx[7](/*games*/ ctx[1]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(h2, "class", "svelte-12m5gy2");
    			add_location(h2, file$6, 121, 6, 3488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*existingBets*/ 4) && t0_value !== (t0_value = getPointsText(/*existingBets*/ ctx[2]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*groupGamesByDate, games, choices, existingBets*/ 142) {
    				each_value = /*groupGamesByDate*/ ctx[7](/*games*/ ctx[1]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(121:109) ",
    		ctx
    	});

    	return block;
    }

    // (119:4) {#if loading}
    function create_if_block_1$4(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(119:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (127:10) {#each group.values as game}
    function create_each_block_1$1(ctx) {
    	let game;
    	let current;

    	game = new Game({
    			props: {
    				choices: /*choices*/ ctx[3],
    				existingBets: /*existingBets*/ ctx[2],
    				game: /*game*/ ctx[14]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(game.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(game, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const game_changes = {};
    			if (dirty & /*choices*/ 8) game_changes.choices = /*choices*/ ctx[3];
    			if (dirty & /*existingBets*/ 4) game_changes.existingBets = /*existingBets*/ ctx[2];
    			if (dirty & /*games*/ 2) game_changes.game = /*game*/ ctx[14];
    			game.$set(game_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(game, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(127:10) {#each group.values as game}",
    		ctx
    	});

    	return block;
    }

    // (123:6) {#each groupGamesByDate(games) as group}
    function create_each_block$2(ctx) {
    	let div;
    	let h4;
    	let t0_value = /*group*/ ctx[11].key.toUpperCase() + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3;
    	let current;
    	let each_value_1 = /*group*/ ctx[11].values;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			attr_dev(h4, "class", "svelte-12m5gy2");
    			add_location(h4, file$6, 124, 10, 3620);
    			add_location(br, file$6, 125, 10, 3666);
    			attr_dev(div, "class", "game-group svelte-12m5gy2");
    			add_location(div, file$6, 123, 8, 3584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*games*/ 2) && t0_value !== (t0_value = /*group*/ ctx[11].key.toUpperCase() + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*choices, existingBets, groupGamesByDate, games*/ 142) {
    				each_value_1 = /*group*/ ctx[11].values;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t3);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(123:6) {#each groupGamesByDate(games) as group}",
    		ctx
    	});

    	return block;
    }

    // (136:6) {#if !allBetsMade(games, existingBets) && anyBetableGames(games) && !loading}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Place bets";
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-12m5gy2");
    			add_location(button, file$6, 136, 8, 3975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*submitBets*/ ctx[6]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(136:6) {#if !allBetsMade(games, existingBets) && anyBetableGames(games) && !loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div3;
    	let div0;
    	let h1;
    	let t1;
    	let selectseason;
    	let t2;
    	let div2;
    	let show_if_1;
    	let current_block_type_index;
    	let if_block0;
    	let t3;
    	let div1;
    	let show_if = !allBetsMade(/*games*/ ctx[1], /*existingBets*/ ctx[2]) && anyBetableGames(/*games*/ ctx[1]) && !/*loading*/ ctx[0];
    	let current;
    	selectseason = new SelectSeason({ $$inline: true });
    	selectseason.$on("season-select-started", /*handleSeasonSelectStarted*/ ctx[5]);
    	selectseason.$on("season-select-finished", /*handleSeasonSelectFinished*/ ctx[4]);
    	const if_block_creators = [create_if_block_1$4, create_if_block_2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*games*/ 2) show_if_1 = null;
    		if (/*loading*/ ctx[0]) return 0;
    		if (show_if_1 == null) show_if_1 = !!(/*games*/ ctx[1].length > 0 && !/*games*/ ctx[1].some(func));
    		if (show_if_1) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = show_if && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Make bets";
    			t1 = space();
    			create_component(selectseason.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			if_block0.c();
    			t3 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			add_location(h1, file$6, 114, 4, 3139);
    			attr_dev(div0, "class", "header svelte-12m5gy2");
    			add_location(div0, file$6, 113, 2, 3113);
    			add_location(div1, file$6, 134, 4, 3875);
    			attr_dev(div2, "class", "content svelte-12m5gy2");
    			add_location(div2, file$6, 117, 2, 3301);
    			attr_dev(div3, "class", "container svelte-12m5gy2");
    			add_location(div3, file$6, 112, 0, 3086);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			mount_component(selectseason, div0, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div2, t3);
    			}

    			if (dirty & /*games, existingBets, loading*/ 7) show_if = !allBetsMade(/*games*/ ctx[1], /*existingBets*/ ctx[2]) && anyBetableGames(/*games*/ ctx[1]) && !/*loading*/ ctx[0];

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectseason.$$.fragment, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectseason.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(selectseason);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function nbrOfSuccessfulBets(bets) {
    	return bets.filter(b => b.successful).length;
    }

    function nbrOfFinishedBets(bets) {
    	return bets.filter(b => b.finished).length;
    }

    function points(bets) {
    	return bets.reduce((x, y) => x + y.points, 0);
    }

    function getPointsText(existingBets) {
    	return `${points(existingBets).toFixed(2)} points (${nbrOfSuccessfulBets(existingBets)}-${nbrOfFinishedBets(existingBets) - nbrOfSuccessfulBets(existingBets)}) 
    `;
    }

    function allBetsMade(games, existingBets) {
    	return existingBets.length === games.filter(g => g.isBetable).length;
    }

    function anyBetableGames(games) {
    	return games.length > 0 && games.some(g => g.isBetable);
    }

    function getGamesToShow(games) {
    	const gamesToShow = games.filter(g => g.isFinished || g.isOngoing || g.isBetable);

    	if (gamesToShow.some(g => g.isBetable)) {
    		return gamesToShow;
    	}

    	return games;
    }

    const func = g => g.awayTeam.name === "TBD" || g.homeTeam.name === "TBD";

    function instance$6($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(8, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MakeBets', slots, []);
    	let loading = false;
    	let games = [];
    	let existingBets = [];
    	let choices = {};

    	async function handleSeasonSelectFinished(evt) {
    		$$invalidate(1, games = evt.detail.games);
    		groupGamesByDate(games);
    		await setUpBets(games);
    		$$invalidate(0, loading = false);
    	}

    	function handleSeasonSelectStarted() {
    		$$invalidate(0, loading = true);
    	}

    	async function submitBets() {
    		const madeChoices = {};

    		for (const key of Object.keys(choices)) {
    			if (choices[key] !== -1) {
    				madeChoices[key] = choices[key];
    			}
    		}

    		if (games.filter(g => g.isBetable).length !== Object.keys(madeChoices).length) {
    			pushErrorToast("You need to bet on all betable games");
    			return;
    		}

    		$$invalidate(0, loading = true);

    		try {
    			await makeBets(madeChoices, $loggedInUser);
    			await setUpBets(games);
    			toast.push("Bets made");
    			$$invalidate(0, loading = false);
    		} catch(err) {
    			$$invalidate(0, loading = false);
    			pushErrorToast("Something went wrong while placing bets");
    		}
    	}

    	async function setUpBets(games) {
    		try {
    			if (games && games.length > 0) {
    				$$invalidate(3, choices = {});
    				$$invalidate(2, existingBets = await fetchBets(games[0].season, games[0].seasonType, games[0].week, $loggedInUser));
    			}
    		} catch(err) {
    			toast.push("Could not fetch bets");
    		}
    	}

    	function groupGamesByDate(games) {
    		const gamesToShow = getGamesToShow(games);

    		const result = groupByArray(gamesToShow, g => {
    			return new Date(g.startTime).toDateString();
    		});

    		return result;
    	}

    	function pushErrorToast(message) {
    		toast.push(message, {
    			theme: {
    				"--toastBackground": "#f54260",
    				"--toastProgressBackground": "white"
    			}
    		});
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MakeBets> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		toast,
    		loggedInUser,
    		fetchBets,
    		makeBets,
    		groupByArray,
    		SelectSeason,
    		LoadingIndicator,
    		Game,
    		loading,
    		games,
    		existingBets,
    		choices,
    		handleSeasonSelectFinished,
    		handleSeasonSelectStarted,
    		submitBets,
    		setUpBets,
    		nbrOfSuccessfulBets,
    		nbrOfFinishedBets,
    		points,
    		getPointsText,
    		groupGamesByDate,
    		allBetsMade,
    		pushErrorToast,
    		anyBetableGames,
    		getGamesToShow,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    		if ('games' in $$props) $$invalidate(1, games = $$props.games);
    		if ('existingBets' in $$props) $$invalidate(2, existingBets = $$props.existingBets);
    		if ('choices' in $$props) $$invalidate(3, choices = $$props.choices);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		loading,
    		games,
    		existingBets,
    		choices,
    		handleSeasonSelectFinished,
    		handleSeasonSelectStarted,
    		submitBets,
    		groupGamesByDate
    	];
    }

    class MakeBets extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MakeBets",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\Navbar.svelte generated by Svelte v3.49.0 */
    const file$5 = "src\\Navbar.svelte";

    // (27:0) {#if $loggedInUser !== null}
    function create_if_block$3(ctx) {
    	let button;
    	let svg;
    	let line0;
    	let line1;
    	let line2;
    	let t;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = (/*open*/ ctx[1] || /*innerWidth*/ ctx[2] > 600) && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			line2 = svg_element("line");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(line0, "id", "top");
    			attr_dev(line0, "x1", "0");
    			attr_dev(line0, "y1", "2");
    			attr_dev(line0, "x2", "32");
    			attr_dev(line0, "y2", "2");
    			attr_dev(line0, "class", "svelte-1s6ktcw");
    			add_location(line0, file$5, 29, 6, 618);
    			attr_dev(line1, "id", "middle");
    			attr_dev(line1, "x1", "0");
    			attr_dev(line1, "y1", "12");
    			attr_dev(line1, "x2", "24");
    			attr_dev(line1, "y2", "12");
    			attr_dev(line1, "class", "svelte-1s6ktcw");
    			add_location(line1, file$5, 30, 6, 672);
    			attr_dev(line2, "id", "bottom");
    			attr_dev(line2, "x1", "0");
    			attr_dev(line2, "y1", "22");
    			attr_dev(line2, "x2", "32");
    			attr_dev(line2, "y2", "22");
    			attr_dev(line2, "class", "svelte-1s6ktcw");
    			add_location(line2, file$5, 31, 6, 731);
    			attr_dev(svg, "width", "32");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "class", "svelte-1s6ktcw");
    			add_location(svg, file$5, 28, 4, 582);
    			attr_dev(button, "class", "hamburger svelte-1s6ktcw");
    			toggle_class(button, "open", /*open*/ ctx[1]);
    			add_location(button, file$5, 27, 2, 507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, line2);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*open*/ 2) {
    				toggle_class(button, "open", /*open*/ ctx[1]);
    			}

    			if (/*open*/ ctx[1] || /*innerWidth*/ ctx[2] > 600) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(27:0) {#if $loggedInUser !== null}",
    		ctx
    	});

    	return block;
    }

    // (35:2) {#if open || innerWidth > 600}
    function create_if_block_1$3(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let p0;
    	let t1;
    	let p0_class_value;
    	let t2;
    	let p1;
    	let t3;
    	let p1_class_value;
    	let t4;
    	let p2;
    	let t5;
    	let p2_class_value;
    	let t6;
    	let h3;
    	let t7_value = /*$loggedInUser*/ ctx[3]?.username + "";
    	let t7;
    	let h3_class_value;
    	let t8;
    	let p3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text("Bets");
    			t2 = space();
    			p1 = element("p");
    			t3 = text("Leagues");
    			t4 = space();
    			p2 = element("p");
    			t5 = text("Statistics");
    			t6 = space();
    			h3 = element("h3");
    			t7 = text(t7_value);
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "Logout";
    			if (!src_url_equal(img.src, img_src_value = "/assets/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "NFL Pick'em");
    			attr_dev(img, "class", "svelte-1s6ktcw");
    			add_location(img, file$5, 37, 8, 904);
    			attr_dev(div0, "class", "title svelte-1s6ktcw");
    			add_location(div0, file$5, 36, 6, 875);
    			attr_dev(p0, "class", p0_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/bets") ? "selected" : "") + " svelte-1s6ktcw"));
    			add_location(p0, file$5, 40, 8, 1037);
    			attr_dev(p1, "class", p1_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/leagues") ? "selected" : "") + " svelte-1s6ktcw"));
    			add_location(p1, file$5, 41, 8, 1138);

    			attr_dev(p2, "class", p2_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/statistics")
    			? "selected"
    			: "") + " svelte-1s6ktcw"));

    			add_location(p2, file$5, 42, 8, 1248);
    			attr_dev(h3, "class", h3_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/profile") ? "selected" : "") + " svelte-1s6ktcw"));
    			add_location(h3, file$5, 43, 8, 1367);
    			attr_dev(p3, "class", "svelte-1s6ktcw");
    			add_location(p3, file$5, 44, 8, 1497);
    			attr_dev(div1, "class", "navbar-pages svelte-1s6ktcw");
    			add_location(div1, file$5, 39, 6, 1001);
    			attr_dev(div2, "class", "navbar svelte-1s6ktcw");
    			add_location(div2, file$5, 35, 4, 847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(p1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p2);
    			append_dev(p2, t5);
    			append_dev(div1, t6);
    			append_dev(div1, h3);
    			append_dev(h3, t7);
    			append_dev(div1, t8);
    			append_dev(div1, p3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(p0, "click", /*click_handler_2*/ ctx[10], false, false, false),
    					listen_dev(p1, "click", /*click_handler_3*/ ctx[11], false, false, false),
    					listen_dev(p2, "click", /*click_handler_4*/ ctx[12], false, false, false),
    					listen_dev(h3, "click", /*click_handler_5*/ ctx[13], false, false, false),
    					listen_dev(p3, "click", /*logOut*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*path*/ 1 && p0_class_value !== (p0_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/bets") ? "selected" : "") + " svelte-1s6ktcw"))) {
    				attr_dev(p0, "class", p0_class_value);
    			}

    			if (dirty & /*path*/ 1 && p1_class_value !== (p1_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/leagues") ? "selected" : "") + " svelte-1s6ktcw"))) {
    				attr_dev(p1, "class", p1_class_value);
    			}

    			if (dirty & /*path*/ 1 && p2_class_value !== (p2_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/statistics")
    			? "selected"
    			: "") + " svelte-1s6ktcw"))) {
    				attr_dev(p2, "class", p2_class_value);
    			}

    			if (dirty & /*$loggedInUser*/ 8 && t7_value !== (t7_value = /*$loggedInUser*/ ctx[3]?.username + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*path*/ 1 && h3_class_value !== (h3_class_value = "" + (null_to_empty(/*path*/ ctx[0].includes("/profile") ? "selected" : "") + " svelte-1s6ktcw"))) {
    				attr_dev(h3, "class", h3_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(35:2) {#if open || innerWidth > 600}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[7]);
    	let if_block = /*$loggedInUser*/ ctx[3] !== null && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$loggedInUser*/ ctx[3] !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(3, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let { currentRoute } = $$props;
    	let path;
    	let open = false;
    	let innerWidth;

    	function logOut() {
    		set_store_value(loggedInUser, $loggedInUser = null, $loggedInUser);
    		src_3("/login");
    	}

    	function goTo(path) {
    		$$invalidate(1, open = false);

    		if ($loggedInUser !== null) {
    			src_3(path);
    		}
    	}

    	const writable_props = ['currentRoute'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(2, innerWidth = window.innerWidth);
    	}

    	const click_handler = () => $$invalidate(1, open = !open);
    	const click_handler_1 = () => goTo("/");
    	const click_handler_2 = () => goTo("/bets");
    	const click_handler_3 = () => goTo("/leagues");
    	const click_handler_4 = () => goTo("/statistics");
    	const click_handler_5 = () => goTo("/profile");

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(6, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => ({
    		loggedInUser,
    		navigateTo: src_3,
    		currentRoute,
    		path,
    		open,
    		innerWidth,
    		logOut,
    		goTo,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(6, currentRoute = $$props.currentRoute);
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    		if ('innerWidth' in $$props) $$invalidate(2, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentRoute*/ 64) {
    			$$invalidate(0, path = currentRoute.name);
    		}
    	};

    	return [
    		path,
    		open,
    		innerWidth,
    		$loggedInUser,
    		logOut,
    		goTo,
    		currentRoute,
    		onwindowresize,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { currentRoute: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentRoute*/ ctx[6] === undefined && !('currentRoute' in props)) {
    			console.warn("<Navbar> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Layout.svelte generated by Svelte v3.49.0 */
    const file$4 = "src\\Layout.svelte";

    function create_fragment$4(ctx) {
    	let div0;
    	let navbar;
    	let t0;
    	let div1;
    	let route;
    	let t1;
    	let sveltetoast;
    	let current;

    	navbar = new Navbar({
    			props: { currentRoute: /*currentRoute*/ ctx[0] },
    			$$inline: true
    		});

    	route = new src_5({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0],
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		});

    	sveltetoast = new SvelteToast({
    			props: { options: /*options*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(route.$$.fragment);
    			t1 = space();
    			create_component(sveltetoast.$$.fragment);
    			attr_dev(div0, "class", "navigation");
    			add_location(div0, file$4, 13, 0, 269);
    			attr_dev(div1, "class", "routes svelte-1nxziro");
    			add_location(div1, file$4, 16, 0, 332);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(navbar, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(route, div1, null);
    			insert_dev(target, t1, anchor);
    			mount_component(sveltetoast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};
    			if (dirty & /*currentRoute*/ 1) navbar_changes.currentRoute = /*currentRoute*/ ctx[0];
    			navbar.$set(navbar_changes);
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(route.$$.fragment, local);
    			transition_in(sveltetoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(route.$$.fragment, local);
    			transition_out(sveltetoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(navbar);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(route);
    			if (detaching) detach_dev(t1);
    			destroy_component(sveltetoast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layout', slots, []);
    	let { currentRoute } = $$props;
    	const params = {};
    	const options = { reversed: true };
    	const writable_props = ['currentRoute'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => ({
    		Route: src_5,
    		Navbar,
    		SvelteToast,
    		currentRoute,
    		params,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentRoute, params, options];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { currentRoute: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentRoute*/ ctx[0] === undefined && !('currentRoute' in props)) {
    			console.warn("<Layout> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Statistics.svelte generated by Svelte v3.49.0 */
    const file$3 = "src\\Statistics.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (35:4) {#each seasons as s}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*s*/ ctx[14] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*s*/ ctx[14];
    			option.value = option.__value;
    			add_location(option, file$3, 35, 6, 1204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(35:4) {#each seasons as s}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {:else}
    function create_else_block$1(ctx) {
    	let h20;
    	let t1;
    	let table0;
    	let t2;
    	let h21;
    	let t4;
    	let table1;
    	let each_value_1 = /*regularSeasonStatistics*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*postSeasonStatistics*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h20 = element("h2");
    			h20.textContent = "Regular season";
    			t1 = space();
    			table0 = element("table");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			h21 = element("h2");
    			h21.textContent = "Post season";
    			t4 = space();
    			table1 = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h20, "class", "svelte-1i1et6h");
    			add_location(h20, file$3, 44, 6, 1449);
    			attr_dev(table0, "class", "svelte-1i1et6h");
    			add_location(table0, file$3, 45, 6, 1480);
    			attr_dev(h21, "class", "svelte-1i1et6h");
    			add_location(h21, file$3, 55, 6, 1791);
    			attr_dev(table1, "class", "svelte-1i1et6h");
    			add_location(table1, file$3, 56, 6, 1819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(table0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, table1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*regularSeasonStatistics*/ 2) {
    				each_value_1 = /*regularSeasonStatistics*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(table0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*postSeasonStatistics*/ 4) {
    				each_value = /*postSeasonStatistics*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(table1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:39) 
    function create_if_block_1$2(ctx) {
    	let h3;
    	let t_value = `No statistics yet for ${/*season*/ ctx[3]}` + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			add_location(h3, file$3, 42, 6, 1384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*season*/ 8 && t_value !== (t_value = `No statistics yet for ${/*season*/ ctx[3]}` + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(42:39) ",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#if loading}
    function create_if_block$2(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (47:8) {#each regularSeasonStatistics as statEntry}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*statEntry*/ ctx[9].description + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*statEntry*/ ctx[9].value + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*statEntry*/ ctx[9].user + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*statEntry*/ ctx[9].valueDescription + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "svelte-1i1et6h");
    			add_location(td0, file$3, 48, 12, 1571);
    			attr_dev(td1, "class", "svelte-1i1et6h");
    			add_location(td1, file$3, 49, 12, 1617);
    			attr_dev(td2, "class", "svelte-1i1et6h");
    			add_location(td2, file$3, 50, 12, 1657);
    			attr_dev(td3, "class", "svelte-1i1et6h");
    			add_location(td3, file$3, 51, 12, 1696);
    			attr_dev(tr, "class", "svelte-1i1et6h");
    			add_location(tr, file$3, 47, 10, 1553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*regularSeasonStatistics*/ 2 && t0_value !== (t0_value = /*statEntry*/ ctx[9].description + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*regularSeasonStatistics*/ 2 && t2_value !== (t2_value = /*statEntry*/ ctx[9].value + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*regularSeasonStatistics*/ 2 && t4_value !== (t4_value = /*statEntry*/ ctx[9].user + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*regularSeasonStatistics*/ 2 && t6_value !== (t6_value = /*statEntry*/ ctx[9].valueDescription + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(47:8) {#each regularSeasonStatistics as statEntry}",
    		ctx
    	});

    	return block;
    }

    // (58:8) {#each postSeasonStatistics as statEntry}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*statEntry*/ ctx[9].description + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*statEntry*/ ctx[9].value + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*statEntry*/ ctx[9].user + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*statEntry*/ ctx[9].valueDescription + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "svelte-1i1et6h");
    			add_location(td0, file$3, 59, 12, 1907);
    			attr_dev(td1, "class", "svelte-1i1et6h");
    			add_location(td1, file$3, 60, 12, 1953);
    			attr_dev(td2, "class", "svelte-1i1et6h");
    			add_location(td2, file$3, 61, 12, 1993);
    			attr_dev(td3, "class", "svelte-1i1et6h");
    			add_location(td3, file$3, 62, 12, 2032);
    			attr_dev(tr, "class", "svelte-1i1et6h");
    			add_location(tr, file$3, 58, 10, 1889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*postSeasonStatistics*/ 4 && t0_value !== (t0_value = /*statEntry*/ ctx[9].description + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*postSeasonStatistics*/ 4 && t2_value !== (t2_value = /*statEntry*/ ctx[9].value + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*postSeasonStatistics*/ 4 && t4_value !== (t4_value = /*statEntry*/ ctx[9].user + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*postSeasonStatistics*/ 4 && t6_value !== (t6_value = /*statEntry*/ ctx[9].valueDescription + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(58:8) {#each postSeasonStatistics as statEntry}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let select;
    	let t2;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*seasons*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[4]) return 0;
    		if (/*statistics*/ ctx[0]?.length === 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Statistics";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div0 = element("div");
    			if_block.c();
    			add_location(h1, file$3, 32, 2, 1091);
    			if (/*season*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[7].call(select));
    			add_location(select, file$3, 33, 2, 1114);
    			attr_dev(div0, "class", "statistics svelte-1i1et6h");
    			add_location(div0, file$3, 38, 2, 1264);
    			attr_dev(div1, "class", "container svelte-1i1et6h");
    			add_location(div1, file$3, 31, 0, 1064);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*season*/ ctx[3]);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[7]),
    					listen_dev(select, "change", /*fetchStatistics*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*seasons*/ 32) {
    				each_value_2 = /*seasons*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*season, seasons*/ 40) {
    				select_option(select, /*season*/ ctx[3]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(8, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Statistics', slots, []);
    	let statistics = [];
    	let regularSeasonStatistics = [];
    	let postSeasonStatistics = [];
    	let seasons = getSeasons();
    	let season = getCurrentSeason();
    	let loading = false;

    	onMount(async () => {
    		$$invalidate(4, loading = true);
    		$$invalidate(0, statistics = await getStatistics($loggedInUser, season));
    		$$invalidate(1, regularSeasonStatistics = statistics?.filter(s => s.seasonType === "Reg"));
    		$$invalidate(2, postSeasonStatistics = statistics?.filter(s => s.seasonType === "Post"));
    		$$invalidate(4, loading = false);
    	});

    	async function fetchStatistics() {
    		$$invalidate(4, loading = true);
    		$$invalidate(0, statistics = await getStatistics($loggedInUser, season));
    		$$invalidate(1, regularSeasonStatistics = statistics?.filter(s => s.seasonType === "Reg"));
    		$$invalidate(2, postSeasonStatistics = statistics?.filter(s => s.seasonType === "Post"));
    		$$invalidate(4, loading = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Statistics> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		season = select_value(this);
    		$$invalidate(3, season);
    		$$invalidate(5, seasons);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		getStatistics,
    		loggedInUser,
    		getCurrentSeason,
    		getSeasons,
    		LoadingIndicator,
    		statistics,
    		regularSeasonStatistics,
    		postSeasonStatistics,
    		seasons,
    		season,
    		loading,
    		fetchStatistics,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('statistics' in $$props) $$invalidate(0, statistics = $$props.statistics);
    		if ('regularSeasonStatistics' in $$props) $$invalidate(1, regularSeasonStatistics = $$props.regularSeasonStatistics);
    		if ('postSeasonStatistics' in $$props) $$invalidate(2, postSeasonStatistics = $$props.postSeasonStatistics);
    		if ('seasons' in $$props) $$invalidate(5, seasons = $$props.seasons);
    		if ('season' in $$props) $$invalidate(3, season = $$props.season);
    		if ('loading' in $$props) $$invalidate(4, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		statistics,
    		regularSeasonStatistics,
    		postSeasonStatistics,
    		season,
    		loading,
    		seasons,
    		fetchStatistics,
    		select_change_handler
    	];
    }

    class Statistics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Statistics",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Profile.svelte generated by Svelte v3.49.0 */
    const file$2 = "src\\Profile.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (31:2) {:else}
    function create_else_block(ctx) {
    	let h3;
    	let t1;
    	let table;
    	let tr0;
    	let td0;
    	let t3;
    	let td1;
    	let t4_value = /*profile*/ ctx[0].statistics?.nbrOfCorrectBets + "";
    	let t4;
    	let t5;
    	let t6_value = /*profile*/ ctx[0].statistics?.nbrOfIncorrectBets + "";
    	let t6;
    	let t7;
    	let tr1;
    	let td2;
    	let t9;
    	let td3;
    	let t10_value = /*profile*/ ctx[0].statistics?.mostPointsInASingleBet + "";
    	let t10;
    	let t11;
    	let tr2;
    	let td4;
    	let t13;
    	let td5;
    	let t14_value = /*profile*/ ctx[0].statistics?.mostPointsInAWeek + "";
    	let t14;
    	let t15;
    	let if_block_anchor;
    	let if_block = /*profile*/ ctx[0].statistics?.teamBetRecords && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "All-time stats";
    			t1 = space();
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Record";
    			t3 = space();
    			td1 = element("td");
    			t4 = text(t4_value);
    			t5 = text(" - ");
    			t6 = text(t6_value);
    			t7 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Most points in a single bet";
    			t9 = space();
    			td3 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Most points in a week";
    			t13 = space();
    			td5 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h3, file$2, 31, 4, 725);
    			attr_dev(td0, "class", "svelte-7xiv9f");
    			add_location(td0, file$2, 34, 8, 783);
    			attr_dev(td1, "class", "svelte-7xiv9f");
    			add_location(td1, file$2, 35, 8, 808);
    			attr_dev(tr0, "class", "svelte-7xiv9f");
    			add_location(tr0, file$2, 33, 6, 769);
    			attr_dev(td2, "class", "svelte-7xiv9f");
    			add_location(td2, file$2, 38, 8, 933);
    			attr_dev(td3, "class", "svelte-7xiv9f");
    			add_location(td3, file$2, 39, 8, 979);
    			attr_dev(tr1, "class", "svelte-7xiv9f");
    			add_location(tr1, file$2, 37, 6, 919);
    			attr_dev(td4, "class", "svelte-7xiv9f");
    			add_location(td4, file$2, 42, 8, 1067);
    			attr_dev(td5, "class", "svelte-7xiv9f");
    			add_location(td5, file$2, 43, 8, 1107);
    			attr_dev(tr2, "class", "svelte-7xiv9f");
    			add_location(tr2, file$2, 41, 6, 1053);
    			attr_dev(table, "class", "svelte-7xiv9f");
    			add_location(table, file$2, 32, 4, 754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t3);
    			append_dev(tr0, td1);
    			append_dev(td1, t4);
    			append_dev(td1, t5);
    			append_dev(td1, t6);
    			append_dev(table, t7);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t9);
    			append_dev(tr1, td3);
    			append_dev(td3, t10);
    			append_dev(table, t11);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t13);
    			append_dev(tr2, td5);
    			append_dev(td5, t14);
    			insert_dev(target, t15, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*profile*/ 1 && t4_value !== (t4_value = /*profile*/ ctx[0].statistics?.nbrOfCorrectBets + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*profile*/ 1 && t6_value !== (t6_value = /*profile*/ ctx[0].statistics?.nbrOfIncorrectBets + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*profile*/ 1 && t10_value !== (t10_value = /*profile*/ ctx[0].statistics?.mostPointsInASingleBet + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*profile*/ 1 && t14_value !== (t14_value = /*profile*/ ctx[0].statistics?.mostPointsInAWeek + "")) set_data_dev(t14, t14_value);

    			if (/*profile*/ ctx[0].statistics?.teamBetRecords) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);
    			if (detaching) detach_dev(t15);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(31:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if loading}
    function create_if_block$1(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(29:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if profile.statistics?.teamBetRecords}
    function create_if_block_1$1(ctx) {
    	let h3;
    	let t1;
    	let each_1_anchor;
    	let each_value = /*profile*/ ctx[0].statistics?.teamBetRecords;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Team bet records (won-lost)";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(h3, file$2, 47, 6, 1236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*profile, displayTeamName, innerWidth*/ 5) {
    				each_value = /*profile*/ ctx[0].statistics?.teamBetRecords;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(47:4) {#if profile.statistics?.teamBetRecords}",
    		ctx
    	});

    	return block;
    }

    // (49:6) {#each profile.statistics?.teamBetRecords as teamBetRecord}
    function create_each_block(ctx) {
    	let table;
    	let tr;
    	let td0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let t1_value = displayTeamName(/*innerWidth*/ ctx[2], /*teamBetRecord*/ ctx[5].team) + "";
    	let t1;
    	let t2;
    	let td1;
    	let t3_value = /*teamBetRecord*/ ctx[5].nbrOfCorrectBets + "";
    	let t3;
    	let t4;
    	let t5_value = /*teamBetRecord*/ ctx[5].nbrOfIncorrectBets + "";
    	let t5;
    	let t6;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			img = element("img");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = text(" - ");
    			t5 = text(t5_value);
    			t6 = space();
    			if (!src_url_equal(img.src, img_src_value = /*teamBetRecord*/ ctx[5].team.logo)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*teamBetRecord*/ ctx[5].team.name);
    			attr_dev(img, "class", "svelte-7xiv9f");
    			add_location(img, file$2, 52, 14, 1428);
    			attr_dev(td0, "class", "team-and-logo svelte-7xiv9f");
    			add_location(td0, file$2, 51, 12, 1386);
    			attr_dev(td1, "class", "svelte-7xiv9f");
    			add_location(td1, file$2, 55, 12, 1593);
    			attr_dev(tr, "class", "svelte-7xiv9f");
    			add_location(tr, file$2, 50, 10, 1368);
    			attr_dev(table, "class", "svelte-7xiv9f");
    			add_location(table, file$2, 49, 8, 1349);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(td0, img);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(td1, t4);
    			append_dev(td1, t5);
    			append_dev(table, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*profile*/ 1 && !src_url_equal(img.src, img_src_value = /*teamBetRecord*/ ctx[5].team.logo)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*profile*/ 1 && img_alt_value !== (img_alt_value = /*teamBetRecord*/ ctx[5].team.name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*innerWidth, profile*/ 5 && t1_value !== (t1_value = displayTeamName(/*innerWidth*/ ctx[2], /*teamBetRecord*/ ctx[5].team) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*profile*/ 1 && t3_value !== (t3_value = /*teamBetRecord*/ ctx[5].nbrOfCorrectBets + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*profile*/ 1 && t5_value !== (t5_value = /*teamBetRecord*/ ctx[5].nbrOfIncorrectBets + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(49:6) {#each profile.statistics?.teamBetRecords as teamBetRecord}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*$loggedInUser*/ ctx[3].username + "";
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[4]);
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			add_location(h1, file$2, 27, 2, 632);
    			attr_dev(div, "class", "container svelte-7xiv9f");
    			add_location(div, file$2, 26, 0, 605);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$loggedInUser*/ 8) && t0_value !== (t0_value = /*$loggedInUser*/ ctx[3].username + "")) set_data_dev(t0, t0_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function displayTeamName(width, team) {
    	return width > 800 ? team.name : team.abbreviation;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let innerWidth;
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(3, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let profile = {};
    	let loading = false;

    	onMount(async () => {
    		$$invalidate(1, loading = true);

    		try {
    			$$invalidate(0, profile = await getProfile($loggedInUser));
    			$$invalidate(1, loading = false);
    		} catch(err) {
    			$$invalidate(1, loading = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(2, innerWidth = window.innerWidth);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		getProfile,
    		loggedInUser,
    		LoadingIndicator,
    		profile,
    		loading,
    		displayTeamName,
    		innerWidth,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('profile' in $$props) $$invalidate(0, profile = $$props.profile);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('innerWidth' in $$props) $$invalidate(2, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(2, innerWidth = 0);
    	return [profile, loading, innerWidth, $loggedInUser, onwindowresize];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\GameDetails.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\GameDetails.svelte";

    // (20:0) {#if loading}
    function create_if_block_1(ctx) {
    	let loadingindicator;
    	let current;
    	loadingindicator = new LoadingIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingindicator, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(20:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if game}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t0_value = /*game*/ ctx[0].awayTeam.name + "";
    	let t0;
    	let t1;
    	let t2_value = /*game*/ ctx[0].homeTeam.name + "";
    	let t2;
    	let t3;
    	let h3;
    	let t4_value = /*game*/ ctx[0].awayTeamScore + "";
    	let t4;
    	let t5;
    	let t6_value = /*game*/ ctx[0].homeTeamScore + "";
    	let t6;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = text(" @ ");
    			t2 = text(t2_value);
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = text(" - ");
    			t6 = text(t6_value);
    			attr_dev(h2, "class", "svelte-remuiz");
    			add_location(h2, file$1, 25, 6, 616);
    			attr_dev(h3, "class", "svelte-remuiz");
    			add_location(h3, file$1, 26, 6, 676);
    			attr_dev(div0, "class", "content svelte-remuiz");
    			add_location(div0, file$1, 24, 4, 587);
    			attr_dev(div1, "class", "container svelte-remuiz");
    			add_location(div1, file$1, 23, 2, 558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(h2, t2);
    			append_dev(div0, t3);
    			append_dev(div0, h3);
    			append_dev(h3, t4);
    			append_dev(h3, t5);
    			append_dev(h3, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game*/ 1 && t0_value !== (t0_value = /*game*/ ctx[0].awayTeam.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*game*/ 1 && t2_value !== (t2_value = /*game*/ ctx[0].homeTeam.name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*game*/ 1 && t4_value !== (t4_value = /*game*/ ctx[0].awayTeamScore + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*game*/ 1 && t6_value !== (t6_value = /*game*/ ctx[0].homeTeamScore + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:0) {#if game}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*loading*/ ctx[1] && create_if_block_1(ctx);
    	let if_block1 = /*game*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*loading*/ ctx[1]) {
    				if (if_block0) {
    					if (dirty & /*loading*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*game*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameDetails', slots, []);
    	let { game } = $$props;
    	let { currentRoute } = $$props;
    	let loading = false;

    	onMount(async () => {
    		$$invalidate(1, loading = true);

    		if (!game) {
    			const gameId = currentRoute.namedParams.id;
    			$$invalidate(0, game = await fetchGame(gameId));
    		}

    		$$invalidate(1, loading = false);
    	});

    	const writable_props = ['game', 'currentRoute'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('game' in $$props) $$invalidate(0, game = $$props.game);
    		if ('currentRoute' in $$props) $$invalidate(2, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		anyEmptyNestedRoutes: utils_1,
    		fetchGame,
    		LoadingIndicator,
    		game,
    		currentRoute,
    		loading
    	});

    	$$self.$inject_state = $$props => {
    		if ('game' in $$props) $$invalidate(0, game = $$props.game);
    		if ('currentRoute' in $$props) $$invalidate(2, currentRoute = $$props.currentRoute);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [game, loading, currentRoute];
    }

    class GameDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { game: 0, currentRoute: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameDetails",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*game*/ ctx[0] === undefined && !('game' in props)) {
    			console.warn("<GameDetails> was created without expected prop 'game'");
    		}

    		if (/*currentRoute*/ ctx[2] === undefined && !('currentRoute' in props)) {
    			console.warn("<GameDetails> was created without expected prop 'currentRoute'");
    		}
    	}

    	get game() {
    		throw new Error("<GameDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set game(value) {
    		throw new Error("<GameDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentRoute() {
    		throw new Error("<GameDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<GameDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let router;
    	let current;

    	router = new src_6({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(div, "class", "routes");
    			add_location(div, file, 78, 0, 2038);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(router, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loggedInUser;
    	validate_store(loggedInUser, 'loggedInUser');
    	component_subscribe($$self, loggedInUser, $$value => $$invalidate(1, $loggedInUser = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	function isLoggedIn() {
    		if ($loggedInUser !== null) {
    			var decoded = o($loggedInUser.token);
    			var nowSeconds = Math.floor(Date.now() / 1000);
    			return decoded.exp > nowSeconds;
    		}

    		return false;
    	}

    	function isNotLoggedIn() {
    		return !isLoggedIn();
    	}

    	let routes = [
    		{
    			name: "/",
    			component: MakeBets,
    			layout: Layout,
    			redirectTo: "/bets",
    			onlyIf: { guard: isLoggedIn, redirect: "/login" }
    		},
    		{
    			name: "login",
    			component: Login,
    			onlyIf: { guard: isNotLoggedIn, redirect: "/" }
    		},
    		{
    			name: "leagues",
    			component: Leagues,
    			layout: Layout,
    			onlyIf: { guard: isLoggedIn, redirect: "/login" }
    		},
    		{
    			name: "leagues/:id",
    			component: League,
    			layout: Layout,
    			onlyIf: { guard: isLoggedIn, redirect: "/login" }
    		},
    		{
    			name: "bets",
    			component: MakeBets,
    			layout: Layout,
    			onlyIf: { guard: isLoggedIn, redirect: "/login" }
    		},
    		{
    			name: "statistics",
    			component: Statistics,
    			layout: Layout,
    			onlyIf: { guard: isLoggedIn, redirect: "/login" }
    		},
    		{
    			name: "profile",
    			component: Profile,
    			layout: Layout,
    			onlyIf: { guard: isLoggedIn, redirect: "/login" }
    		},
    		{
    			name: "games/:id",
    			component: GameDetails,
    			layout: Layout,
    			onlyIf: { guard: isLoggedIn, redirect: "/login" }
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: src_6,
    		jwtDecode: o,
    		Login,
    		Leagues,
    		League,
    		MakeBets,
    		loggedInUser,
    		Layout,
    		Statistics,
    		Profile,
    		GameDetails,
    		isLoggedIn,
    		isNotLoggedIn,
    		routes,
    		$loggedInUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(0, routes = $$props.routes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: "world",
      },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

# Ring of Servers

## This is just a prototype of an idea

## 1) As Circular Linked List

- Say you have some Node processes. Maybe you have some data-centers, and each datacenter has a couple of production machines, which can be referenced: `dc1/prod/0`, `dc2/prod/0`, `dc3/prod/0`, `dc1/prod/1`, `dc2/prod/1`, `dc3/prod/1`, etc.

- How you enumerate them is irrelevant, but **pick the enumeration at the beginning, and stick to it**

- In this example, we will name the instances `A`, `B`, `C`, `D`.

- Organise the instances as a circular linked list (for now, just abstract): `A => B => C => D => A`

- Concretely, each process will act both as a **Client**, and as a **Server**.

- For the instance `C`:

  - `C` is a **Client** for `D`:
    - `C` will call `D` (thus `C` will have a stream from `D`)
  - `C` is a **Server** for `B`:
    - `B` will call `C` (thus `C` will have a stream from `B`)

- Now pipe them

## 2) As CERN

- You now have a CERN-like circular **tunnel**.

- In Node, when you pipe streams, **data starts flowing**.

- But our topology is circular.

- Say you drop _a metallic particle_ in the tunnel, just before you seal the tunnel.

- The _particle_ will then spin in circles. It's like having an electro-magnetic field in the tunnel.

## 3) As airport circular train/bus (config bus?)

- Your instances are the stops.

- You can simulate a station by injecting a Transform stream.

- You can even delay the particle at each stop, or you can let it travel at maximal speed.

## 4) Applications

### Measure health of cluster

- You can detect when a machine dies, and one of the ones _holding its hand_ will realise its partner fell into a sinkhole. So it will be aware of it, and it can respawn it, and reconstruct the ring.

- You can measure latency, by measuring frequency at which the particle returns.

### Sync. Sync tick.

- This allows you to synchronize data on the instances.

- A low hanging fruit is syncronizing some sort of ticking on the instances.

- You tick when the _particle/train_ is just beneath you.

- This is what we implement in this package, as a prototype.

- Runing **yarn start** will create Node instances. They are enumerated by port ranging from 3000 to 3010 (inclusive).

- Then watch the logs (it might take a while, until the tunnel fully forms).

- See comments in **src/index.js**

### Fight DDOS attacks

- A right DDOS defensive strategy requires the fleet to comunicate. For example, instances should correlate "catalogs of secret tokens".

- Of course, when we say DDOS, we assume there exists another server on your instance: the actual **application server** for your clients. The server in the ring is rather an **admin server**.

### Fast deploys

- You can just provide deltas, which propagate

### Caching (a'la'memcache but maybe stronger)

- Memcache says "same data maps always to same machine, independent on who calls". So if a machine dies, all input mapping to it is compromised.

- The ring allows for "the next one" to take all the attributions of the one who died, until it comes back to life.

- You can even try to be more general than memcache, and to not map deterministically the input to a machine. In this case, you want to minimize the duplicated storage. So you can store just deltas. Then the instances start talking between themselves and quickly aggregate the deltas into a final response (sharing is caring).

- So technique can be used also in CI, and is not just user facing.

## 5) Expander graphs

- Propagating via a “ring” is slow, so of course, you’d prefer more edges, so that instances can very very quickly broadcast data across the fleet

- You want an expander graph structure: https://en.wikipedia.org/wiki/Expander_graph

"In graph theory, an expander graph is a sparse graph that has strong connectivity properties, quantified using vertex, edge or spectral expansion. Expander constructions have spawned research in pure and applied mathematics, with several applications to complexity theory, design of robust computer networks, and the theory of error-correcting codes"

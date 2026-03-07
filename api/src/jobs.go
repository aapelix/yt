package src

import "sync"

var (
	jobs  = map[string]*Job{}
	mu    sync.Mutex
	queue = make(chan *Job, 100)
)

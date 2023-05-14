---
categories:
- Guides
class: post-template
comments: true
cover: media/algorithms_small_logo.png
current: post
date: 2013-02-10 00:34:45
layout: post
navigation: true
slug: parallel-data-processing
subclass: post
tags:
- consumer
- gil
- multicore
- multiprocessing
- producer
- python
- queues
- threads
title: Parallel data processing
wordpress_id: 1219
---

Developing an application or script which process data is a straight-forward pattern: data is collected, processed and the result is provided to be stored in a file or database. Those three blocks (collect, process, store) forms a pipeline and in the old days this pipeline is implemented in a series of synchronous function calls passing the data (or the pointer to the data) from one step to the next.

I'm talking about the old-days because this synchronous approach occupy only one core of the CPU but we usually have more than one core (2, 4 or even 8 cores on a single die) which means we will run or data processing application at only 50, 25 or 12.5 percent of the maximum computational power of our CPU.

However with asynchronous programming and the use of the `multiprocessing` package we can spread the load all over the available cores and increase the processing power and decreasing the time needed to finish the task.

<!-- more -->



### A note about threads and process and Python



A little note beforehand: beacuse of the [GIL](http://wiki.python.org/moin/GlobalInterpreterLock) the CPython threads cannot be executed in parallel so starting _n_ number of threads will use always one core of the CPU (this is a side effect but it's a rough rule of thumb).

To workaround to this limitation the [`multiprocessing`](http://docs.python.org/2/library/multiprocessing.html) starts multiple instance of the interpreter and execute the code in parallel circumventing the limitation of the GIL.



### The application



To explain how to code an asynchronous multi-core data processor I will write a simple photo to thumbnail generator using a producer-consumer-sink pattern.

It will scan recursively a given folder, generates a thumbnail representation of any image found and write a list of generated thumbnails into a text file.



### Step 1: The producer



The scope of the producer is to producer walk the content of the given folder recursively  and generate a list of candidate files for the generation of the thumbnail:




    def filename_producer(root_folder, out_queue, consumers):
        # Walk into all subfolders and output every file found
        for root, dirs, filenames in os.walk(root_folder):
            for filename in filenames:
                # Build filename with absolute path
                filename = os.path.abspath(os.path.join(root, filename))
                filename = filename.decode("utf-8")

                # Put it nto the queue
                out_queue.put(filename)

        # Put a number of sentinels equal to the number of workers
        for i in xrange(consumers):
            out_queue.put(StopIteration)




The function accepts the folder where to start the walk process, the output queue of the filenames and a number of consumers connected to the output queue.

The first loop just iterates recursively from the root folder pushing any file found into the output queue; the next loop push a number of sentinels equal to the number of consumers connected to the queue.

I'll explain why we need to pass the number of consumers and why we need to push sentinels into the output queue later in this post.



### Step 2: The consumer



The consumer fetch a filename and generate a thumbnail if the file is a known image format thus push the thumbnail's filename into the sink's queue:




    def thumbnail_consumer(in_queue, out_queue, size, thumb_dir):
        # Create thumbnail directory if doesn.t exits
        if not os.path.exists(thumb_dir):
            os.makedirs(thumb_dir)

        while 1:
            # Fetch filename from queue
            filename = in_queue.get()

            # Skip if stop iteration
            if filename == StopIteration:
                break

            # Try to load the file
            try:
                image = Image.open(filename)
            except IOError:
                continue

            logger.info("Processing file %s", os.path.split(filename)[1])

            # Create thumbnail of the file
            image.thumbnail(size, Image.ANTIALIAS)

            # Generate thumbnail's filename by the digest of the image
            digest = hashlib.sha256(image.tostring()).hexdigest()
            thumbnail = "{}.png".format(digest)

            # Save image as PNG
            image.save(os.path.join(thumb_dir, thumbnail), "PNG")

            # Push original filename and thumbnail
            out_queue.put((filename, thumbnail))

        # Send a iteration's stop
        out_queue.put(StopIteration)




The `while` loop iterates infinitely fetching a new filename form the producer's queue, generate and save the thumbnail using the hash of the thumbnail's content as the filename and push the original and the thumbnail's filenames into the sink's queue.

If `PIL` fails to load the image (i.e. it's not a known image format) continue to the next filename. However if the item fetched from the producer queue is a stop iteration sentinel exist the loop and push the sentinel into the sink's queue.



### Step 3: The sink



The last step saves the thumbnail filenames into a list in a text file:




    def sink_consumer(in_queue, filename, workers):
        # Create folder if doesn't exists
        if os.path.exists(filename):
            os.remove(filename)

        with codecs.open(filename, "wb", encoding="utf-8") as f:
            # Cycle until the number of active workers is greater than 0
            while workers:
                # Fetch item from the queue
                result = in_queue.get()

                if result == StopIteration:
                    # It's a stop iteration, decrement number of active workers
                    workers -= 1
                else:
                    # Unpack item and write the result into the file
                    filename, hash_ = result

                    f.write("{1}: {0}\n".format(filename, hash_))



The functions creates a new empty file and writes all the filenames received from the sink's queue, decrementing the `workers` counter every time a sentinel value is received, exiting the loop when it reaches zero.



### Wire them together



Time to wire all these functions together so the the data produced by exploring the folder will flow through the consumers and the result will be push into the sink.

At first we get the number of workers from the command line or, if no number is given, we use the number of cores detected by `multiprocessing`:




    if __name__ == "__main__":
        # Save timestamp
        start = datetime.datetime.now()

        # Select number of workers
        if len(sys.argv) == 3:
            workers = int(sys.argv[2])
        else:
            workers = multiprocessing.cpu_count()




We create the two [`Queue`](http://docs.python.org/2/library/multiprocessing.html#multiprocessing.Queue) objects to connect the producer to the consumers and the consumers to the sink.




        # Create queues
        producer_queue = Queue()
        sink_queue = Queue()




Start the producer, the consumers (stored into a list) and the sink by instances of [`Process`](http://docs.python.org/2/library/multiprocessing.html#multiprocessing.Process).



        # Producer
        producer = Process(
            target=filename_producer, args=(sys.argv[1], producer_queue, workers))
        producer.start()

        # Consumers
        consumers = []

        for i in xrange(workers):
            consumer = Process(
                target=thumbnail_consumer,
                args=(producer_queue, sink_queue, (200, 200), "thumbnails")
            )
            consumer.start()
            consumers.append(consumer)

        sink = Process(
            target=sink_consumer, args=(sink_queue, "processed.txt", workers))
        sink.start()




All the process are started, now we just need to wait for the sink to consume all the data flowing from the consumers (remember, the sink's function exits when all the workers had finished which means the producer had finished of emitting filenames to be processed)




        # Join the sink consumer
        sink.join()

        # Print elapsed time
        logger.info("Finished in %s", datetime.datetime.now() - start)






### Why the sentinel



The sentinel value is necessary as a way to notify all the process that the producer had finished on generating data so e use a `StopIteration` exception object as an appropriate sentinel for a generator object as the producer.

We generate one sentinel for every worker otherwise the first worker which fetch the sentinel will stop but the other workers will wait indefinitely for new value from the producer queue.

The sink loop will decrease a worker's counter every time a sentinel is fetch from the queue (which means a worker had finished) and exits the loop when the counter of the active workers reaches zero.



### Performances



How fast the code can process thumbnails with different number of active workers?

I ran the code agains a folder of 188 pictures for a total of 540Mb on my MacBook Pro Core 2 Due 2.2GHz. I ran it a couple of time before recording timings to fill the OS cache so the execution time will be bound to sheer computational power completely excluding the disk I/O overhead.


| Workers          | Time (s) |
|------------------|:--------:|
| 1 worker 2 cores |       19 |
| 2 worker 2 cores |       10 |
| 4 worker 2 cores |       10 |
| 8 worker 2 cores |       12 |

Unsurprisingly using 2 workers take half the time but increasing to 4 or 8 workers doesn't make any difference and with 8 workers the execution time starts to increase.

Increasing the number of active workers to a number greater of the number of cores just increase the overhead of switching between workers on the same core reducing the performances.

Last note, in this example 4 processes are started on a CPU with only 2 physical cores but the execution time is bound only to the number of thumbnail generator workers because the producer and the sink doesn't have a big impact on the CPU (they spend more time in disk I/O operations).

The code used in this post can be download [here]({{ site.url }}/media/processing.py_.zip).